import { messengerConfigReceived } from '../'

describe('messengerConfigReceived', () => {
  it('matches template', () => {
    expect(messengerConfigReceived('inputObject')).toEqual({
      payload: 'inputObject',
      type: 'messengerConfigReceived'
    })
  })
})
