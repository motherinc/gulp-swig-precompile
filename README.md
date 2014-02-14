# gulp-swig-precompile [![Build Status](https://travis-ci.org/motherinc/gulp-swig-precompile.png?branch=master)](https://travis-ci.org/motherinc/gulp-swig-precompile)

Swig precompiler for gulp

## Install

Install as a development dependency using npm

````
npm install --save-dev gulp-swig-precompile
````

## Example

This example makes your templates AMD modules.

````
var gulp = require('gulp'),
    swig = require('gulp-swig-precompile'),
    path = require('path');

gulp.task('templates', function () {
   gulp.src('views/**/*.html', { base: path.join(__dirname, 'views') })
      .pipe(swig({ output: 'define(function () { return <%= template %>; });' }))
      .pipe(gulp.dest('public/js'));
});
````

## API

### swig(options)

You can pass in the same options as those avialble in [Swig Options](http://paularmstrong.github.io/swig/docs/api/#SwigOpts), as well as the desired output format, custom filters, and custom tags.

#### output

Default: ````var tpl = <%= template %>;````

An inline template specifying how you would like the results of the precompilation formatted. Two variables are passed in to the template: ````template```` and ````file````. 

Example usage:

````
{ output: 'templates.register("<%= file.relative %>", <%= template %>);' }
````

#### filters

An object containing custom filters, where the keys are filter names, and values are corresponding filter functions.

To learn more on custom filters in Swig, read the [official documentation](http://paularmstrong.github.io/swig/docs/extending/#filters) regarding this.

#### tags

An object containing custom tags, where the keys are tag names, and values are corresponding tag objects with ````parse````, ````compile````, ````ends````, and ````blockLevel```` properties.

To learn more on custom tags in Swig, read the [official documentation](http://paularmstrong.github.io/swig/docs/extending/#tags) regarding this.
