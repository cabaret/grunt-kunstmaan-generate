/*
 * grunt-kunstmaan-generate
 * https://github.com/cabaret/grunt-kunstmaan-generate
 *
 * Copyright (c) 2013 Joris Ooms for Kunstmaan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerTask('kuma-generate', 'Easily create new SCSS modules within a Kunstmaan project.', function(type, name) {
    var fs = require('fs'),
        done = this.async(),
        cwd = process.cwd(),
        config;

    config = {
      'basePath': '/scss/',
      'generalPath': '/scss',
      'componentsPath': '/scss/components/'
    }
    var createComponent = function(name, done) {
      fs.exists(cwd + config.componentsPath + '_' + name + '.scss', function(exists) {
        if(exists) {
          throw "File _" + name + ".scss exists!";
        } else {
          fs.writeFile(cwd + config.componentsPath + '_' + name + '.scss', '', function (err) {
            if (err) throw err;
            grunt.log.ok('Generated scss/components/' + name + '.scss ');

            fs.appendFile(cwd + config.componentsPath + '_components.scss', '\n@import \'' + name + '\';', function(err) {
              if (err) throw err;
              grunt.log.ok('Appended "@import \'' + name + '\';" to _components.scss');
              done();
            });
          });
        }
      });
    };
    
    switch(type) {
      case 'component':
        createComponent(name, done);
        break;
    }
  });

};
