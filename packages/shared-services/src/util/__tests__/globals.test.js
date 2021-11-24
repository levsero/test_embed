import * as devices from 'src/util/devices'
import { isPopout, setReferrerMetas, getReferrerPolicy, getZendeskHost } from 'src/util/globals'

test('when window.zEPopout is true, isPopout returns true', () => {
  window.zEPopout = true
  expect(isPopout()).toEqual(true)
})

test('when window.zEPopout is false, isPopout returns false', () => {
  window.zEPopout = false
  expect(isPopout()).toEqual(false)
})

describe('setReferrerMetas', () => {
  let mockIframe = { contentDocument: {} },
    mockMetaTags = [{ content: 'hello' }, { content: 'world' }],
    mockDoc = {}

  beforeEach(() => {
    jest.spyOn(devices, 'getMetaTagsByName').mockImplementation(() => mockMetaTags)
    jest.spyOn(devices, 'appendMetaTag').mockImplementation(() => {})
    setReferrerMetas(mockIframe, mockDoc)
  })

  afterEach(() => {
    devices.getMetaTagsByName.mockRestore()
    devices.appendMetaTag.mockRestore()
  })

  it('appends two referrerMeta values to the iframe doc', () => {
    expect(devices.appendMetaTag).toHaveBeenCalledTimes(2)
  })

  it('append the correct meta tags', () => {
    expect(devices.appendMetaTag).toHaveBeenCalledWith(mockDoc, 'referrer', 'hello')
    expect(devices.appendMetaTag).toHaveBeenCalledWith(mockDoc, 'referrer', 'world')
  })

  it('sets the Referrer Policy to the last element', () => {
    expect(getReferrerPolicy()).toEqual('world')
  })
})

describe('getZendeskHost', () => {
  test('getZendeskHost returns document.zendeskHost', () => {
    let result

    document.zendeskHost = 'test.zendesk.com'
    result = getZendeskHost(document)

    expect(result).toEqual('test.zendesk.com')

    document.zendeskHost = null
  })

  test('getZendeskHost returns document.webWidget.id', () => {
    let result

    document.zendesk = { web_widget: { id: 'test3.zendesk.com' } } // eslint-disable-line camelcase
    result = getZendeskHost(document)

    expect(result).toEqual('test3.zendesk.com')

    document.zendesk = null
  })

  test('getZendeskHost returns document.web_widget.id', () => {
    let result

    document.web_widget = { id: 'test2.zendesk.com' } // eslint-disable-line camelcase
    result = getZendeskHost(document)

    expect(result).toEqual('test2.zendesk.com')

    document.web_widget = null // eslint-disable-line camelcase
  })
})
