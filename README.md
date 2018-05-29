# Embeddable Framework [![Build Status](https://magnum.travis-ci.com/zendesk/embeddable_framework.svg?token=eFe58axP7zq8qUuk6pMA&branch=master)](https://magnum.travis-ci.com/zendesk/embeddable_framework)

## Description
A 3rd party embeddable framework that handles bringing Zendesk outside of the agent view and onto 3rd party websites.

## Owners
This repository is maintained by [Team Taipan](https://zendesk.atlassian.net/wiki/pages/viewpage.action?pageId=86114732). You can get in touch with us via:
* Email **taipan@zendesk.com**
* Slack **#taipan-team** channel
* Mention **@zendesk/taipan** on Github

We are based in Melbourne, Australia and our timezone is **GMT+10**. You can always check the [time](http://time.is/Melbourne) in Melbourne.

## Getting Started
*Note: This assumes you already have node and [nvm](https://github.com/creationix/nvm) installed.*

### Set up NVM
Ensure `$NVM_DIR` is set and pointing to the location of your nvm installation:
```
echo $NVM_DIR
```

If not already present, add the following line to your bash or zsh profile:
```
source $NVM_DIR/nvm.sh
```

Ensure that you can run nvm from your command line, and then run the following

```bash
nvm use
```

### Run the bootstrap script
Run the following commands inside this folder:

```bash
./script/bootstrap
```

The bootstrap file will do the following:

* Set Node version
* Install selenium-server globally
* Run `npm install` to get all dependencies
* Run `bundle install` to get ruby dependencies
* Run `npm run build` to generate snippet, framework and example files
* Download rosetta translation and mappings into `src/translation/ze_translations.js` and `src/translation/ze_localeIdMap.js`
* Download countries translation into `src/translation/ze_countries.js`
* Download graphicsmagick, imagemagick & cairo using brew
* Run npm install webdriverio & webdrivercss (these depend on the above)

To run the embeddables locally type `npm run watch` in this folder for it to kick off. This creates a dist folder with `main.js`, `boostrap.js` files and generates some example html files where you can run the framework loaded via our snippet. Visit [http://localhost:1337/webpack-dev-server/](http://localhost:1337/webpack-dev-server/) to test live examples.

We recommended installing the [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) extension on your browser.

#### Setting up your own test values

To use your own values in the watch task you can create a new .watch file for the thing you'd like to test. Prefix it with a dash and the name of the group you want to use.

```bash
cp config/.watch.example config/.watch-${your_config_name}
```

Then edit the values inside the config to point wherever you like. You can then use this config in your watch task by running

```bash
npm run watchConf ${your_config_name}
```

This will start a watch task using the values found in /config/.watch-${your_config_name}. The next time you start a watch task it will use the file you set last here.

This will allow you to make as many different configurations as you like to test different scenarios with. It's recommended to have one for dev and one for your prod account.

## Getting Started with Asset Composer
First ensure that the project is bootstrap by following the instructions above.

You will need to setup docker-images. Instructions can be found here: https://github.com/zendesk/docker-images#installation.

Start the `embed_key_registry` application. If the image is not found, zdi will automatically pull it down.

```bash
zdi embed_key_registry start
```

Note: You can also run this application in development mode `zdi embed_key_registry -d start` if you wish to debug the `asset_composer.js` script. This will require you cloning and setting up Embed Key Registry. Instructions can be found in the `README.md` on the Github [repositiory](https://github.com/zendesk/embed_key_registry).

Then run the `watch:ac` npm task

```bash
npm run watch:ac
```

Or run the `watchConf:ac` npm task with the config you want to use.

```bash
npm run watchConf:ac ${your_config_name}
```

Finally navigate to [http://localhost:1337/webpack-dev-server/asset_composer.html](http://localhost:1337/webpack-dev-server/asset_composer.html). The Asset Composer version of the Web Widget should load on the page using the local Embed Key Registry application running in Docker.

View the confluence [documentation](https://zendesk.atlassian.net/wiki/spaces/CE/pages/332529715/End-to-end+development+for+Asset+Composer+Web+Widget) for more details.

## Running in Docker
- Follow above to get `npm run watch` running.
- Run `zdi embeddable_framework -d restart` in parallel.

### Building Docker image
- Run `npm run build` to build static assets inside `./dist`.
- Run `zdi embeddable_framework build`.
- Verify the built image with `zdi embeddable_framework restart -l`.
- To push, run `zdi embeddable_framework release --official`.

## Testing
We use the [Jasmine](http://jasmine.github.io/) framework for all our unit tests, and [ESlint](http://eslint.org/) for Javascript linting. Please run both the test and lint npm tasks before opening a pull request.

```bash
npm run lint && npm t
```

To debug in tests, run the `test:debug` task: `npm run test:debug`. This task uses the built-in cli node.js debugger. To set a breakpoint from the source code, place a `debugger` statement on the line you want to pause execution. To inspect the value of variables run the `repl` command at a breakpoint. For more information please view the [documentation](https://nodejs.org/api/debugger.html#debugger_information).

*NOTE: The node debugger will always automatically break at the first line, just run `continue` (or `c`) to resume execution.*

## Contribute
All pull requests need two :+1:'s to be merged, *at least one from a Taipan team member*. Please also include a `/cc` to **@zendesk/taipan**. If a Taipan team member hasn't reviewed your PR in a reasonable amount of time, feel free to ping us on Slack in `#taipan-team` and do a group mention using `@taipan`.

See [STYLE.md](https://github.com/zendesk/embeddable_framework/blob/master/STYLE.md) for more information on code style.

*Note: There is a pull request template (PULL_REQUEST_TEMPLATE.md) for auto completing the description. If you have the Zendesk chrome dev tools installed this will cause a conflict so disable the dev tools before opening a PR.*

## Deploying
Please see our [Deploy guidelines](https://github.com/zendesk/embeddable_framework/blob/master/DEPLOY.md) for more information.

## Bugs
Bugs are tracked in JIRA under the Customer Engagement project (`CE`) with the component *Web Widget*. Bugs should always have clear reproduction steps, some notion of urgency/scope and relevant references.

## Refreshing Rosetta translations
To download the latest translations, run the following command from the root of this project:

```bash
./script/fetch_i18n
```

## Refreshing countries translations from CLDR
To download the latest translations, run the following command from the root of this project:

```bash
./script/fetch_countries
```

## Generating a JWT token
To generate a JWT token for development purposes, run the following command from the root of this project:

```bash
node ./script/generate-jwt.js <shared_secret>
```

*`<shared_secret>` = a generated shared secret (e.g `4fcd8ac941baf1b9cf1bf0b8272d5bcf`)*

## Testing CSP
See the **CSP.md** document for instructions on how to test CSP with the Web Widget.

## NPM tasks
Run each task like this: ```npm run <taskname>```

* **build** - Generates snippet and framework in production mode. This means the final source and assets are optimised and no sourcemaps are generated.
* **watch** - Runs webpack-dashboard and launches a local server that automatically rebuilds the source and refreshes the browser on any changes. Navigate to http://localhost:1337/webpack-dev-server
* **test** - Runs all the jasmine unit tests.
* **lint** - Runs eslint on the *src* and *test* directories.

## Debugging customer issues
Sometimes we have issues that only manifest on customers sites.

### Viewing Redux logs
To see redux logging information on their site we can add a value to localstorage to surface the debug logs.

In the browsers console
```
localStorage["ZD-debug"] = true
```

After that when you refresh the page you will start seeing redux logs in your console.

### Using your development version of main.js
Here is [an article](https://zendesk.atlassian.net/wiki/spaces/CE/pages/111936245/Debugging+on+3rd+party+websites) explaining how we can use burp to hijack the main.js request and point it to a local version.

## Documenting ADRs
We will be documenting architectural decisions surrounding this project under `doc/architecture/decisions`.
The standards followed are documented by Michael Nygard at:
http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions

### Tooling and ADR generation
Please refer to https://github.com/npryce/adr-tools
