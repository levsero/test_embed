# Embeddable Framework [![Build Status](https://magnum.travis-ci.com/zendesk/embeddable_framework.svg?token=eFe58axP7zq8qUuk6pMA&branch=master)](https://magnum.travis-ci.com/zendesk/embeddable_framework)

A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Getting started

This assumes you already have node and nvm installed.

```bash
    brew install node nvm
```

Ensure the following line is present in your bash or zsh profile:
```
    source $(brew --prefix nvm)/nvm.sh
```

Ensure that you can run nvm from your command line, and then run the following

```bash
  nvm use
```

Run the following commands inside this folder:

```bash
./script/bootstrap
```

The bootstrap file will do the following:

* Set Node version
* Install bower & selenium-server globally
* Run `npm install & bower install` to get all dependencies
* Run `npm build:debug` to generate snippet, framework and example files
* Download rosetta translation into `src/translation/translation.json`
* Download graphicsmagick, imagemagick & cairo using brew
* Run npm install webdriverio & webdrivercss (these depend on the above)

To test the embeddables type `npm run watch` in this folder for it to kick off. This creates a dist folder with `main.js`, `boostrap.js` files and generates some example html files where you can run the framework loaded via our snippet. Visit [http://localhost:1337/example/](http://localhost:1337/example/) to test live examples.

## Refreshing Rosetta translations

To download the latest translations, run the following command from the root of this project:

```bash
./script/fetch_i18n
```

## Npm tasks

Run each task like this: ```npm run taskname```

* **build:debug** - Generates snippet, framework and example files in development mode. This means the final source and assets are not optimised and sourcemaps are generated for debugging.
* **build** - Generates snippet and framework in production mode. This means the final source and assets are optimised and no sourcemaps are generated.
* **watch** - Runs build:debug and launches a local server that automatically rebuilds the source and refreshes the browser on any changes. Navigate to http://localhost:1337/example/
* **test** - Runs all the jasmine unit tests.
* **lint** - Runs eslint on the *src* and *test* directories.
