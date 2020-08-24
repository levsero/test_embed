import { configReceived } from '../'

describe('configReceived', () => {
  it('matches template', () => {
    expect(configReceived('inputObject')).toEqual({
      payload: 'inputObject',
      type: 'messenger/configReceived'
    })
  })
})
