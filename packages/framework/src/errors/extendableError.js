export default function() {
  function ExtendableError(...args) {
    Error.apply(this, args)
  }
  ExtendableError.prototype = Object.create(Error.prototype)
  Object.setPrototypeOf(ExtendableError, Error)
  return ExtendableError
}
