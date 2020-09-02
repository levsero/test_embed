class ObserverList {
  constructor() {
    this.observers = []
  }

  addObserver(callback) {
    this.observers.push(callback)
  }

  removeObserver(callback) {
    this.observers = this.observers.filter(observer => observer !== callback)
  }

  notify(...args) {
    this.observers.forEach(callback => {
      callback(...args)
    })
  }
}

export default ObserverList
