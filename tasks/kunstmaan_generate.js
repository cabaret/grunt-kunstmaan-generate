/*
 * grunt-kunstmaan-generate
 * https://github.com/cabaret/grunt-kunstmaan-generate
 *
 * Copyright (c) 2013 Joris Ooms for Kunstmaan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require('fs'),
    cwd = process.cwd(),
    prompt = require('prompt'),
    paths, imports,
    kunstmaan;

  kunstmaan = {
    paths: {
      'mixin'       : '/scss/helpers/mixins/',
      'config'      : '/scss/config/',
      'general'     : '/scss/general/',
      'component'   : '/scss/components/',
      'placeholder' : '/scss/helpers/placeholders/'
    },

    imports: {
      'mixin'       : '_mixins.scss',
      'config'      : '_config.scss',
      'general'     : '_general.scss',
      'component'   : '_components.scss',
      'placeholder' : '_placeholders.scss',
    },
    generate: function(name, type, done) {
      var im = '\n@import \'' + name + '\';\n',
          file = '_' + name + '.scss',
          path = kunstmaan.paths[type] + file,
          fullPath = cwd + kunstmaan.paths[type] + file,
          appendPath = cwd + kunstmaan.paths[type] + kunstmaan.imports[type];

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
              grunt.log.ok('Appended "@import ' + name + ';" to ' + kunstmaan.imports[type]);
              done();
            });
          });
        }
      });
    }
  };

  grunt.registerTask('kg', 'Easily create new SCSS modules within a Kunstmaan project.', function(type, name) {
    var done = this.async();

    if ((typeof name === 'undefined' && typeof type === 'undefined') || type === 'help') {
      console.log('\n------------------------ ');
      console.log('Kunstmaan Generate Task:   ');
      console.log('------------------------   ');
      grunt.log.ok('kg:TYPE:NAME\n');
      console.log('\nPossible types are: component, mixin, config, placeholder, general\n');
    } else if (typeof name === 'undefined' && type in kunstmaan.paths) {
      prompt.start();
      prompt.message = 'Please provide a name for your ' + type + ' file';
      prompt.get(['name'], function(err, result){
        kunstmaan.generate(result.name, type, done);
      });
    } else if (type in kunstmaan.paths) {
      kunstmaan.generate(name, type, done);
    }
  });

};
