const base = require('./jest.config.base')
const project = require('./package.json')

module.exports = {
  ...base,
  rootDir: __dirname,

  roots: ['<rootDir>'],
  projects: project.workspaces,
}
