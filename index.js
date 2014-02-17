'use strict';

var PLUGIN_NAME = 'gulp-swig-precompile';

var gutil   = require('gulp-util'),
    through = require('through2'),
    swig    = require('swig'),
    xtend   = require('xtend');


module.exports = function (options) {
   options = options || {};

   return through.obj(function (file, enc, cb) {

      var defaults = {
         filename: file.relative,
         locals: {},
         loader: swig.loaders.fs(file.base),
         output: 'var tpl = <%= template %>;'
      };

      options = xtend({}, defaults, options);

      if (file.isNull()) {
         this.push(file);
         return cb();
      }

      if (file.isStream()) {
         this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
         return cb();
      }

      try {
         if (options.loader) {
            swig.setDefaults({ loader: options.loader });
         }
         
         if (options.filters) {
            for (var f in options.filters) {
               if (options.filters.hasOwnProperty(f)) {
                  swig.setFilter(f, options.filters[f]);
               }
            }
         }

         if (options.tags) {
            for (var t in options.tags) {
               if (options.tags.hasOwnProperty(t)) {
                  var tag = options.tags[t];
                  swig.setTag(t, tag.parse, tag.compile, tag.ends, tag.block);
               }
            }
         }

         var tmpl = swig.precompile(file.contents.toString(), options).tpl.toString().replace('anonymous', '');
         tmpl = gutil.template(options.output, { template : tmpl, file : file });
         file.contents = new Buffer(tmpl);
         file.path = gutil.replaceExtension(file.path, '.js');
      } catch (err) {
         this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
      }

      this.push(file);
      cb();
   });
};
