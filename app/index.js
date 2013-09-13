'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var StreamhubGenerator = module.exports = function StreamhubGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this._appSkeletonRepo = {
    githubUsername: 'cheung31',
    githubRepo: 'streamhub-app-skeleton'
  };

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(StreamhubGenerator, yeoman.generators.Base);

StreamhubGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'appName',
    message: "What's the name of the app?"
  }, {
    name: 'githubUsername',
    message: "What's your Github username?"
  }, {
    name: 'appDescription',
    message: "What's the application do?",
    default: "A new app built on top of Livefyre StreamHub"
  }, ];

  this.prompt(prompts, function (props) {
    this.appName = props.appName;
    this.githubUsername = props.githubUsername;
    this.appDescription = props.appDescription;

    cb();
  }.bind(this));
};

StreamhubGenerator.prototype.app = function app() {
  var cb = this.async();

  var refreshCache = true;
  this.remote(
    this._appSkeletonRepo.githubUsername,
    this._appSkeletonRepo.githubRepo,
    'master',
    function (err, remote) {
      console.log('Fetching ' + this._appSkeletonRepo.githubUsername + '/' + this._appSkeletonRepo.githubRepo + ' ...');
      remote.directory('./', './');

      cb(); // Done fetching

      remote.template('package.json', 'package.json', this);
      remote.template('bower.json', 'bower.json', this);
      remote.template('requirejs.conf.js', 'requirejs.conf.js', this);
    }.bind(this),
    refreshCache
  );
};
