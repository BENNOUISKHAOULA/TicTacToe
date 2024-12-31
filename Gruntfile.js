module.exports = function(grunt) {
  var src_img = "src.png";
  var src_img_width_to_height_ratio = 1024/1024;
  var directory = "auto_resize_images";
  var output_directory = directory + "/output";
  var padColor = "FFFFFF"; // white in HEX
  var desired_sizes = [
    "1024x1024",
    "512x512",
    "50x50",
    "android/Phone-656x1054",
    "ios/iphone6plus-5.5inch-1242x2208",
    "phonegap/icon-120"
  ];
  var commands = [];
  var subdirectories = {};

  commands.push('rm -rf ' + output_directory);
  commands.push('mkdir ' + output_directory);
  commands.push('mkdir ' + output_directory + '/temp');

  for (var i = 0; i < desired_sizes.length; i++) {
    var desired_size = desired_sizes[i];
    var slashIndex = desired_size.indexOf("/");
    if (slashIndex !== -1) {
      var subdirectory = desired_size.substring(0, slashIndex);
      if (!subdirectories[subdirectory]) {
        subdirectories[subdirectory] = true;
        commands.push('mkdir ' + output_directory + '/' + subdirectory);
      }
    }
    var lastDashIndex = desired_size.lastIndexOf("-");
    var dimensions = desired_size.substring(lastDashIndex + 1);
    var width_height = dimensions.split("x");
    var width = Number(width_height[0]);
    var height = Number(width_height[width_height.length - 1]);
    
    var is_height_limiting = width / src_img_width_to_height_ratio > height;
    var scale_to_width = is_height_limiting ? height * src_img_width_to_height_ratio : width;
    var scale_to_height = is_height_limiting ? height : width / src_img_width_to_height_ratio;

    commands.push('sips ' + directory + '/' + src_img + ' --resampleHeightWidth ' +
      scale_to_height + ' ' + scale_to_width +
      ' -s format bmp --out ' + output_directory + '/temp/' + dimensions + '.bmp');

    commands.push('sips ' + output_directory +
      '/temp/' + dimensions + '.bmp -s format png --padToHeightWidth ' +
      height + ' ' + width +
      ' --padColor ' + padColor + ' --out ' + output_directory + '/' + desired_size + ".png");
  }
  commands.push('rm -rf ' + output_directory + '/temp');

  var auto_resize_images_command = commands.join(" && ");

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      auto_resize_images_on_mac: {
        command: auto_resize_images_command
      }
    },
    ts: {
      default: {
        options: {
          fast: 'never'  // disable the grunt-ts fast feature
        },
        tsconfig: true
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['ChromeHeadless'],  // Utilisation de Chrome Headless pour éviter les problèmes en Docker
        customLaunchers: {
          ChromeHeadlessNoSandbox: {
            base: 'ChromeHeadless',
            flags: ['--no-sandbox']
          }
        }
      }
    },
    copy: {
      imgs: {
        expand: true,
        src: 'imgs/*.*',
        dest: 'dist/'
      }
    },
    concat: {
      options: {
        separator: '\n;\n'
      },
      js: {
        src: [
          'lib/angular.js',
          'lib/turnBasedServices.4.js',
          'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js'
        ],
        dest: 'dist/js/everything.js'
      }
    },
    postcss: {
      options: {
        map: {
          inline: false,
          annotation: 'dist/css/maps/'
        },
        processors: [
          require('autoprefixer'),  // Corrigé (sans ())
          require('cssnano')  // Corrigé (sans options obsolètes)
        ]
      },
      dist: {
        src: 'css/game.css',
        dest: 'dist/css/everything.min.css'
      }
    },
    uglify: {
      options: {
        sourceMap: true
      },
      my_target: {
        files: {
          'dist/js/everything.min.js': ['dist/js/everything.js']
        }
      }
    },
    processhtml: {
      dist: {
        files: {
          'dist/index.min.html': ['index.html']
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: '.',
          cache: [
            'js/everything.min.js',
            'css/everything.min.css'
          ],
          network: ['*'],
          timestamp: true
        },
        dest: 'dist/index.min.appcache',
        src: []
      }
    },
    'http-server': {
      'dev': {
        root: '.',
        port: 9000,
        host: "0.0.0.0",
        cache: 1,
        showDir: true,
        autoIndex: true,
        ext: "html",
        runInBackground: true
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s)
  grunt.registerTask('default', [
    'ts',
    'karma',
    'copy',
    'concat',
    'postcss',
    'uglify',
    'processhtml',
    'manifest',
    'http-server'
  ]);

  // Task to ignore warnings temporarily
  grunt.registerTask('force', function() {
    grunt.option('force', true);
  });
};
