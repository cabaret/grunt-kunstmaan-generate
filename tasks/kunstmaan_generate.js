/*
 * grunt-kunstmaan-generate
 * https://github.com/cabaret/grunt-kunstmaan-generate
 *
 * Copyright (c) 2013 Joris Ooms for Kunstmaan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerTask('kg', 'Easily create new SCSS modules within a Kunstmaan project.', function(type, name) {
    var fs = require('fs'),
        done = this.async(),
        cwd = process.cwd(),
        paths, files,
        kgenerate;

    paths = {
      'mixin'       : '/scss/helpers/mixins/',
      'config'      : '/scss/config/',
      'general'     : '/scss/general/',
      'component'   : '/scss/components/',
      'placeholder' : '/scss/helpers/placeholders/'
    };

    files = {
      'mixin'       : '/scss/helpers/mixins/_mixins.scss',
      'config'      : '/scss/config/_config.scss',
      'general'     : '/scss/general/_general.scss',
      'component'   : '/scss/components/_components.scss',
      'placeholder' : '/scss/helpers/placeholders/_placeholders.scss',
    };

    kgenerate = function(name, type, done) {
      var im = '\n@import \'' + name + '\';\n',
          file = '_' + name + '.scss',
          path = paths[type] + file,
          fullPath = cwd + paths[type] + file,
          appendPath = cwd + files[type];

      fs.exists(fullPath, function(exists) {
        if (exists) {
          throw "File " + file + " exists!";
        } else {
          var data = '';

          if(type === 'mixin') {
            data = '@mixin ' + name + ' {}';
          }
          if(type === 'placeholder') {
            data = '%' + name + ' {}';
          }

          fs.writeFile(fullPath, data, function(err) {
            if (err) {
              throw err;
            }
            grunt.log.ok('Generated ' + path);

            fs.appendFile(appendPath, im, function(err) {
              if (err) {
                throw err;
              }
              grunt.log.ok('Appended "@import ' + name + ';" to ' + files[type]);
              done();
            });
          });
        }
      });
    };

    if ((typeof name === 'undefined' && typeof type === 'undefined') || type === 'help') {
      console.log('\n------------------------ ');
      console.log('Kunstmaan Generate Task:   ');
      console.log('------------------------   ');
      grunt.log.ok('kg:TYPE:NAME\n');
      console.log('\nPossible types are: component, mixin, config, placeholder, general');
    } else if (typeof name === 'undefined' && type in paths) {
      // prompt
    } else if (type in paths) {
      kgenerate(name, type, done);
    }
  });

};
