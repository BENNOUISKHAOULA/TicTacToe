module.exports = function(config) {
  config.set({
    basePath: './',

    files: [
      'lib/angular.js',
      'lib/turnBasedServices.4.js',
      'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js',
      'ts_output_readonly_do_NOT_change_manually/src/aiService.js',
      'ts_output_readonly_do_NOT_change_manually/src/gameLogic_test.js',
      'ts_output_readonly_do_NOT_change_manually/src/aiService_test.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js': ['coverage'],
      'ts_output_readonly_do_NOT_change_manually/src/aiService.js': ['coverage']
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    autoWatch: true,
    frameworks: ['jasmine'],

    // Custom launcher for ChromeHeadless to avoid sandbox issues
    customLaunchers: {
      ChromeWithoutSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    // Use the custom launcher by default
    browsers: ['ChromeWithoutSandbox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage'
    ]
  });
};
