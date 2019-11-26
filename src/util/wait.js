const wait = (time = 0) => {
  return new Promise(res => {
    setTimeout(() => {
      res()
    }, time)
  })
}

export default wait
