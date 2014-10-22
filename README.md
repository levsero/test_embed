# Embeddable Framework [![Build Status](https://magnum.travis-ci.com/zendesk/embeddable_framework.svg?token=eFe58axP7zq8qUuk6pMA&branch=master)](https://magnum.travis-ci.com/zendesk/embeddable_framework)

A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Getting started

This assumes you already have node installed. Run the following commands inside this folder:

```bash
./script/bootstrap
```

The bootstrap file will do the following:

* Install gulp, bower, jasmine-node & selenium-server globally
* Run npm install & bower install to get all dependencies
* Run gulp build-dev to generate snippet, framework and example files
* Setup pre-commit hook
* Download rosetta translation into `src/translation/translation.json`
* Download graphicsmagick, imagemagick & cairo using brew
* Run npm install webdriverio & webdrivercss (these depend on the above)

To test the embeddables type `gulp watch` in this folder for it to kick off. This creates a dist folder with `main.js`, `boostrap.js` files and generates some example html files where you can run the framework loaded via our snippet. Visit [http://localhost:1337/example/](http://localhost:1337/example/) to test live examples.

## Automated UI Regression testing (beta)

To run the UI regression tests you'll need to have run `script/bootstrap` to get all the deps.

To actually run the UI tests follow these steps:

* Run `gulp watch` to start the server
* Run `selenium` command
* Run `gulp test-ui`
* Bask in the eternal glory
* Once completed screenshots will be stored in `./webdrivercss/`
