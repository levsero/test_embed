const isNativeFunction = (func) => {
  // Native functions that have not been overwritten will return `function scrollTo() { [native code] }`
  // when you call toString() on them
  const test = /\{\s+\[native code\]/.test(Object.prototype.toString.call(func))
  return test
}

export { isNativeFunction }
