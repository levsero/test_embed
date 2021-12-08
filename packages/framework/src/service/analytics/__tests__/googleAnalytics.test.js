import { GA } from '../googleAnalytics'

let { globals } = require('@zendesk/widget-shared-services')

describe('when there is no GA snippet on the page', () => {
  beforeEach(() => {
    globals.win = {}
  })

  it('returns null', () => {
    GA.init()

    expect(GA.get()).toBe(null)
  })
})

describe('when there is a new GA snippet on the page', () => {
  let tracker
  beforeEach(() => {
    tracker = { send: jest.fn() }
    const ga = (fun) => {
      fun()
    }
    ga.getAll = () => [tracker]
    globals.win = {
      GoogleAnalyticsObject: 'ga',
      ga,
    }
    GA.init()
  })

  it('tracks actions correctly', () => {
    GA.track('widget opened', { id: 1, name: 'hello' })
    expect(tracker.send).toHaveBeenCalledWith('event', {
      eventAction: 'widget opened',
      eventCategory: 'Zendesk Web Widget',
      eventLabel: '1 - hello',
      eventValue: undefined,
      hitType: 'event',
    })
  })
})

describe('when there is a old GA snippet on the page', () => {
  beforeEach(() => {
    globals.win = {
      _gaq: 'oldGaq',
      _gat: 'oldGat',
    }
    GA.init()
  })

  it('returns an object containing the gat and gaq of the window', () => {
    expect(GA.get()).toEqual({
      gaq: 'oldGaq',
      gat: 'oldGat',
    })
  })
})
