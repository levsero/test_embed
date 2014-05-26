# Engagement Framework [![Build Status](https://magnum.travis-ci.com/zendesk/engagement_framework.svg?token=eFe58axP7zq8qUuk6pMA&branch=master)](https://magnum.travis-ci.com/zendesk/engagement_framework)


A 3rd party engagement framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Getting started

This assumes you already have node installed. Run the following commands inside this folder:

```bash
./script/bootstrap
```

Note: you may need to make this bootstrap file executable by running:

```bash
chmod +x script/bootstrap
```

The bootstrap file will do the following:

* Install gulp and bower globally
* Run npm install & bower install to get all dependencies
* Run gulp build-dev to generate snippet, framework and example files
* Setup pre-commit hook

To run the build type `gulp build-dev` in this folder for it to kick off. This creates a dist folder with `main.js`, `boostrap.js` files and generates some example html files where you can run the framework loaded via our snippet.

