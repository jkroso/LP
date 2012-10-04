/*global module*/
module.exports = function(grunt) { 'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		shell: {
			docco: {
				command: 'docco'+
				' src/Component.js'+
				' src/LP.js',
				stderr: true,
				failOnError: true
			},
			requirejs : {
				command : 'r.js.cmd -o build.js',
				stderr: true,
				failOnError: true
			},
			_options: {
				stdout: console.log
			}
		},
		lint: {
			files: ['src/**/*.js', 'test/**/*.js']
		},
		qunit: {
			files: ['test/LP.html']
		},
		concat: {
			dist: {
				src: ['<banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: ['<banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		}
	});

	grunt.registerTask('default', 'concat min')

};
