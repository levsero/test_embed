const getScrollBottom = element => {
  const { scrollHeight, scrollTop, offsetHeight } = element

  return scrollHeight - (scrollTop + offsetHeight)
}

export default getScrollBottom
