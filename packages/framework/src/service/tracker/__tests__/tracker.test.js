import { beacon } from 'src/service/beacon'
import tracker from '../tracker'

jest.mock('src/service/beacon')

beforeEach(() => {
  tracker.send = false
  tracker.queue = []
})

it('does not track if disabled', () => {
  tracker.send = false
  tracker.track('blah')

  expect(beacon.trackUserAction).not.toHaveBeenCalled()
})

describe('suspend', () => {
  beforeEach(() => {
    tracker.send = true
    tracker.suspend(() => {
      tracker.track('hello')
    })
  })

  it('does not track', () => {
    expect(beacon.trackUserAction).not.toHaveBeenCalled()
  })

  it('does not enqueue anything', () => {
    expect(tracker.queue.length).toEqual(0)
  })
})

describe('enabled', () => {
  beforeEach(() => {
    tracker.send = true
  })

  it('skips blacklisted functions', () => {
    tracker.track('webWidget.identify', { x: 1 })

    expect(beacon.trackUserAction).not.toHaveBeenCalled()
  })

  it('sends to beacon with expected arguments', () => {
    tracker.track('webWidget.prefill', { x: 1 })

    expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'webWidget.prefill', {
      value: { args: { x: 1 } },
    })
  })

  it('sends to beacon with array arguments', () => {
    tracker.track('webWidget.prefill', [1, 2])

    expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'webWidget.prefill', {
      value: { args: [1, 2] },
    })
  })

  it('handles function arguments', () => {
    tracker.track('webWidget.prefill', () => {})

    expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'webWidget.prefill', {
      value: { args: '<callback function>' },
    })
  })

  it('handles no arguments', () => {
    tracker.track('webWidget.blah')

    expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'webWidget.blah', {
      value: { args: null },
    })
  })

  describe('addTo', () => {
    let subject

    beforeEach(() => {
      subject = {
        add: (x, y) => x + y,
      }
      tracker.addTo(subject, 'test')
    })

    test('function still works', () => {
      expect(subject.add(3, 4)).toEqual(7)
    })

    test('tracks the function call', () => {
      subject.add(5, 9)

      expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'test.add', {
        value: { args: [5, 9] },
      })
    })
  })

  describe('addToMethod', () => {
    let subject

    beforeEach(() => {
      subject = {
        add: (x, y) => x + y,
        minus: 123,
      }
      tracker.addToMethod(subject, 'add', 'testing')
    })

    test('function still works', () => {
      expect(subject.add(3, 4)).toEqual(7)
    })

    test('tracks the function call', () => {
      subject.add(5, 9)

      expect(beacon.trackUserAction).toHaveBeenCalledWith('api', 'testing', {
        value: { args: [5, 9] },
      })
    })

    test('ignores non function calls', () => {
      tracker.addToMethod(subject, 'minus', 'testinghere')
      subject.minus

      expect(beacon.trackUserAction).not.toHaveBeenCalledWith(
        'api',
        'testinghere',
        expect.anything()
      )
    })
  })

  describe('queueing', () => {
    beforeEach(() => {
      tracker.enqueue('method1', 1, 2, 3)
      tracker.enqueue('method2')
      tracker.enqueue('method3', () => {})
    })

    it('enqueues items', () => {
      expect(tracker.queue.length).toEqual(3)
    })

    describe('flushing', () => {
      beforeEach(() => {
        tracker.flush()
      })

      it('removes everything in the queue', () => {
        expect(tracker.queue.length).toEqual(0)
      })

      it('tracks everything in the queue', () => {
        expect(beacon.trackUserAction).toHaveBeenCalledTimes(3)

        expect(beacon.trackUserAction).toHaveBeenNthCalledWith(1, 'api', 'method1', {
          value: { args: [1, 2, 3] },
        })
        expect(beacon.trackUserAction).toHaveBeenNthCalledWith(2, 'api', 'method2', {
          value: { args: null },
        })
        expect(beacon.trackUserAction).toHaveBeenNthCalledWith(3, 'api', 'method3', {
          value: { args: '<callback function>' },
        })
      })
    })
  })

  describe('disabled to enabled', () => {
    beforeEach(() => {
      tracker.send = false
      tracker.track('api1', 1, 2, 3)
      tracker.track('api2')
    })

    it('does not track if send is false', () => {
      expect(beacon.trackUserAction).not.toHaveBeenCalled()
    })

    it('tracks everything once enabled', () => {
      tracker.init()
      expect(beacon.trackUserAction).toHaveBeenNthCalledWith(1, 'api', 'api1', {
        value: { args: [1, 2, 3] },
      })
      expect(beacon.trackUserAction).toHaveBeenNthCalledWith(2, 'api', 'api2', {
        value: { args: null },
      })
    })
  })
})
