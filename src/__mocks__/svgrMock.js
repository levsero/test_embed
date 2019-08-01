const path = require('path')

module.exports = {
  process(src, filename) {
    return `
      Object.defineProperty(exports, "__esModule", {
        value: true
      })
      
      exports.default = () => String(${JSON.stringify(path.basename(filename))})
    `
  }
}
