describe('audio service', () => {
  const loadIsolatedAudioService = () => {
    let myModule
    jest.isolateModules(() => {
      myModule = require('..').default
    })
    return myModule
  }

  it('stores the audio to be played at any time', () => {
    const audio = loadIsolatedAudioService()

    const mockPlay = jest.fn()

    function FakeAudio(path) {
      return {
        play: () => mockPlay(path),
      }
    }

    global.Audio = FakeAudio

    audio.load('some_name', 'fake/audio/path')
    audio.load('some_other_name', 'another/fake/audio/path')

    audio.play('some_name')

    expect(mockPlay).toHaveBeenCalledWith('fake/audio/path')
  })

  describe('when loading a sound where key already exists', () => {
    it('throws an error in dev mode', () => {
      global.__DEV__ = true

      const audio = loadIsolatedAudioService()

      audio.load('one')
      expect(() => audio.load('one')).toThrowError(
        `Sound with key "one" already exists in the store`
      )
    })

    it('does not throw an error in production', () => {
      global.__DEV__ = false
      const audio = loadIsolatedAudioService()

      audio.load('one')
      expect(() => audio.load('one')).not.toThrow()
    })
  })
})
