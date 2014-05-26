# Engagement Framework [![Build Status](https://magnum.travis-ci.com/zendesk/engagement_framework.svg?token=eFe58axP7zq8qUuk6pMA&branch=master)](https://magnum.travis-ci.com/zendesk/engagement_framework)


A 3rd party engagement framework that handles brining Zendesk outside of the agent view and onto 3rd party websites.

## Getting started

This assumes you already have node installed. Run the following commands inside this folder:

```bash
npm install -g gulp bower
npm install && bower install
```

To run the build type `gulp build` in this folder for it to kick off. This creates a dist folder with `main.js` and `boostrap.js`  files.

## Pre-commit hook

To get the pre-commit hook setup which will lint and run tests follow these instructions:

1. In this directory run `ln -s ../../pre-commit.sh .git/hooks/pre-commit`
1. Then you need to make sure it's executable `chmod +x .git/hooks/pre-commit`

Now if the tests or linting fails you won't be able to commit.

