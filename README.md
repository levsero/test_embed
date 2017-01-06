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

Run the following commands inside this folder:

```bash
./script/bootstrap
```

The bootstrap file will do the following:

* Set Node version
* Install selenium-server globally
* Run `npm install` to get all dependencies
* Run `npm build:debug` to generate snippet, framework and example files
* Download rosetta translation into `src/translation/translation.json`
* Download graphicsmagick, imagemagick & cairo using brew
* Run npm install webdriverio & webdrivercss (these depend on the above)

To run the embeddables locally type `npm run watch` in this folder for it to kick off. This creates a dist folder with `main.js`, `boostrap.js` files and generates some example html files where you can run the framework loaded via our snippet. Visit [http://localhost:1337/webpack-dev-server/](http://localhost:1337/webpack-dev-server/) to test live examples.

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

See the **STYLE.md** document for more information on code style.

*Note: There is a pull request template (PULL_REQUEST_TEMPLATE.md) for auto completing the description. If you have the Zendesk chrome dev tools installed this will cause a conflict so disable the dev tools before opening a PR.*

## Bugs
Bugs are tracked in JIRA under the Customer Engagement project (`CE`) with the component *Web Widget*. Bugs should always have clear reproduction steps, some notion of urgency/scope and relevant references.

## Refreshing Rosetta translations

To download the latest translations, run the following command from the root of this project:

```bash
./script/fetch_i18n
```

## Generating a JWT token

To generate a JWT token for development purposes, run the following command from the root of this project:

```bash
node ./script/generate-jwt.js <shared_secret>
```

*`<shared_secret>` = a generated shared secret (e.g `4fcd8ac941baf1b9cf1bf0b8272d5bcf`)*

## NPM tasks

Run each task like this: ```npm run taskname```

* **build:debug** - Generates snippet, framework and example files in development mode. This means the final source and assets are not optimised and sourcemaps are generated for debugging.
* **build** - Generates snippet and framework in production mode. This means the final source and assets are optimised and no sourcemaps are generated.
* **watch** - Runs build:debug and launches a local server that automatically rebuilds the source and refreshes the browser on any changes. Navigate to http://localhost:1337/example/
* **test** - Runs all the jasmine unit tests.
* **lint** - Runs eslint on the *src* and *test* directories.
