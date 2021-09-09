import { document as doc } from 'src/util/globals'

const getNativeFunction = (nativeFunctionName) => {
  // Restore a native function implementation by grabbing a copy from a new iframe when it has been
  // overridden. This is required, when a user or theme author overrides a function with their own
  // implementation which breaks the widget.
  // https://dev.to/js_bits_bill/how-to-restore-native-browser-code-3e6e
  var tempFrame = doc.createElement('iframe')
  doc.body.appendChild(tempFrame)
  const nativeFunction = tempFrame.contentWindow[nativeFunctionName]
  tempFrame.parentNode.removeChild(tempFrame)
  return nativeFunction
}

const isNativeFunction = (func) => {
  // Native functions that have not been overwritten will return `function scrollTo() { [native code] }`
  // when you call toString() on them
  const test = /\{\s+\[native code\]/.test(Object.prototype.toString.call(func))
  return test
}

export { getNativeFunction, isNativeFunction }
