const sounds = {}

const audio = {
  load(key, path) {
    if (sounds[key] && __DEV__) {
      throw new Error(`Sound with key "${key}" already exists in the store`)
    }

    sounds[key] = new Audio(path)
  },
  play(key) {
    sounds[key].play()
  },
}

export default audio
