import React from 'react'
import { render } from 'src/util/testHelpers'
import useSnapcallUpdateTime from '../useSnapcallUpdateTime'

jest.mock('src/embeds/talk/hooks/useTransformTime', () => input => input)

let map = {}
window.addEventListener = jest.fn((event, cb) => {
  map[event] = cb
})

describe('useTransformTime', () => {
  // eslint-disable-next-line react/prop-types
  const SomeComponent = ({ time }) => {
    useSnapcallUpdateTime(time)

    return null
  }

  it('attaches the callback to the snapcallEvent_callCurrentTimer window event', () => {
    render(<SomeComponent time={1} />)

    expect(window.addEventListener).toHaveBeenCalledWith(
      'snapcallEvent_callCurrentTimer',
      expect.any(Function)
    )
  })
})
