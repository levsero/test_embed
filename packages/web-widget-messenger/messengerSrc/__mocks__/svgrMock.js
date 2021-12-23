const path = require('path')

module.exports = {
  process(src, filepath) {
    return `
      Object.defineProperty(exports, "__esModule", {
        value: true
      })      
      const React = require('react');
      exports.default = props => (
        React.createElement(
          'svg',
          {
            realfilename: ${JSON.stringify(path.basename(filepath))},
            ...props            
          }
        )
      )
    `
  },
}
