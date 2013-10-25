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
      'mixin'       : 'scss/helpers/mixins/',
      'config'      : 'scss/config/',
      'general'     : 'scss/general/',
      'component'   : 'scss/components/',
      'placeholder' : 'scss/helpers/placeholders/'
    },

    imports: {
      'mixin'       : '_mixins.scss',
      'config'      : '_config.scss',
      'general'     : '_general.scss',
      'component'   : '_components.scss',
      'placeholder' : '_placeholders.scss',
    },
    generate: function(name, type, done, pathToFiles, subDir) {
      var im = '\n@import "' + subDir + name + '";\n',
          file = '_' + name + '.scss',
          path = pathToFiles + kunstmaan.paths[type] + file,
          fullPath = cwd + pathToFiles + kunstmaan.paths[type] + subDir + file,
          appendPath = cwd + pathToFiles + kunstmaan.paths[type] + kunstmaan.imports[type],
          comment = '/* ==========================================================================\n' + name + '\n\nStyle guide: https://github.com/necolas/idiomatic-css\n========================================================================== */\n';


      fs.exists(fullPath, function(exists) {
        if (exists) {
          throw "File " + file + " exists!";
        } else {
          var data = comment;

          if(type === 'mixin') {
            data += '\n@mixin ' + name + ' {}';
          }
          if(type === 'placeholder') {
            data += '\n%' + name + ' {}';
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

  grunt.registerTask('kg', 'Easily create new SCSS modules within a Kunstmaan project.', function(type, name, subDir) {
    var done = this.async();

    // Check if a sub directory is given, else the sub directory is empty
    var _subDir = function(val) {
      if(typeof val === 'undefined' && subDir === val) {
        val = '';
      } else {
        val += '/';
      }

      return val;
    };

    if ((typeof name === 'undefined' && typeof type === 'undefined' && typeof subDir === 'undefined') || type === 'help') {
      console.log('\n------------------------ ');
      console.log('Kunstmaan Generate Task:   ');
      console.log('------------------------   ');
      grunt.log.ok('kg:TYPE:NAME\n');
      console.log('\nPossible types are: component, mixin, config, placeholder, general\n');
    } else if (typeof name === 'undefined' && typeof subDir === 'undefined' && type in kunstmaan.paths) {
      prompt.start();
      prompt.message = 'Please provide a name for your ' + type + ' file';
      prompt.get(['name'], function(err, result){
        if(typeof result.name !== 'undefined' && result.name !== null && result.name !== '') {
          name = result.name;

          prompt.message = 'Please provide a subdirectory for your ' + type + ' file ' + name + '(Leave blank for no subdirectory)';
          prompt.get(['subDir'], function(err, result){
            if(typeof result.subDir !== 'undefined' && result.subDir !== null) {
              if(result.subDir !== '') {
                subDir = _subDir(result.subDir);
              } else {
                subDir = result.subDir;
              }
              kunstmaan.generate(name, type, done, grunt.config.data.kg.path, subDir);
            }
          });
        }
      });
    } else if (type in kunstmaan.paths) {
      kunstmaan.generate(name, type, done, grunt.config.data.kg.path, _subDir(subDir));
    }
  });

};
