export default window.parent

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const restoreHostPageScrollPositionIfSafari = (callback) => {
  if (!isSafari) {
    callback?.()
    return
  }

  const x = window.parent.scrollX,
    y = window.parent.scrollY

  callback()

  setTimeout(() => {
    window.parent.scrollTo(x, y)
  }, 1)
}
