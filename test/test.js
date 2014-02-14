/* global describe, it, beforeEach */

'use strict';

var assert   = require('assert'),
    fs       = require('fs'),
    gutil    = require('gulp-util'),
    path     = require('path'),
    swig     = require('swig'),
    compiler = require('../index');

var filters  = require('./filters'),
    tags     = require('./tags');

var n = new swig.Swig(),
    oDefaults = n.options;

function resetOptions() {
   swig.setDefaults(oDefaults);
   swig.invalidateCache();
}

describe('gulp-swig-precompile', function() {

   beforeEach(resetOptions);

   it('should precompile a basic swig template', function(done) {
      var stream = compiler();
      var fakeFile = new gutil.File({
         base: __dirname,
         path: __dirname + '/fixtures/basic.fixture.html',
         contents: fs.readFileSync(path.join(__dirname, 'fixtures', 'basic.fixture.html'))
      });

      stream.on('data', function(newFile) {
         var expectation = fs.readFileSync(path.join('test', 'expectations', 'basic.expectation.js'), 'utf8');
         assert.equal(String(newFile.contents),expectation);
      });

      stream.on('end', function() {
         done();
      });

      stream.write(fakeFile);
      stream.end();
   });

   it('should precompile a swig template with custom filters', function(done) {
      var stream = compiler({ filters: filters });
      var fakeFile = new gutil.File({
         base: __dirname,
         path: __dirname + '/fixtures/filter.fixture.html',
         contents: fs.readFileSync(path.join(__dirname, 'fixtures', 'filter.fixture.html'))
      });

      stream.on('data', function(newFile) {
         var expectation = fs.readFileSync(path.join('test', 'expectations', 'filter.expectation.js'), 'utf8');
         assert.equal(String(newFile.contents),expectation);
      });

      stream.on('end', function() {
         done();
      });

      stream.write(fakeFile);
      stream.end();
   });

   it('should precompile a swig template with custom tags', function(done) {
      var stream = compiler({ tags: tags });
      var fakeFile = new gutil.File({
         base: __dirname,
         path: __dirname + '/fixtures/tag.fixture.html',
         contents: fs.readFileSync(path.join(__dirname, 'fixtures', 'tag.fixture.html'))
      });

      stream.on('data', function(newFile) {
         var expectation = fs.readFileSync(path.join('test', 'expectations', 'tag.expectation.js'), 'utf8');
         assert.equal(String(newFile.contents),expectation);
      });

      stream.on('end', function() {
         done();
      });

      stream.write(fakeFile);
      stream.end();
   });
});
