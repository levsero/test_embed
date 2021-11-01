import messenger from 'src/apps/messenger'
import webWidget from 'src/apps/webWidget'
import { fetchEmbeddableConfig } from 'src/framework/api/embeddableConfig'
import framework from 'src/framework/framework'
import * as blacklist from 'src/framework/isBlacklisted'
import errorTracker from 'src/framework/services/errorTracker'

jest.mock('src/framework/api/embeddableConfig')
jest.mock('src/framework/services/errorTracker')
jest.mock('src/apps/messenger')
jest.mock('src/apps/webWidget')
jest.mock('src/framework/isBlacklisted')

describe('start', () => {
  const mockMessengerConfig = {
    messenger: {},
  }
  const mockWebWidgetConfig = {
    talk: {},
  }

  it('does not boot if the end user is blacklisted', async () => {
    blacklist.isBlacklisted.mockReturnValue(true)

    await framework.start()

    expect(fetchEmbeddableConfig).not.toHaveBeenCalled()
    blacklist.isBlacklisted.mockReturnValue(false)
  })

  it('does not boot if window.zESkipWebWidget is true', async () => {
    window.parent.zESkipWebWidget = true

    await framework.start()

    expect(fetchEmbeddableConfig).not.toHaveBeenCalled()
    window.parent.zESkipWebWidget = false
  })

  it('does boot if window.zESkipWebWidget is false and user is not blacklisted', async () => {
    window.parent.zESkipWebWidget = false

    await framework.start()

    expect(fetchEmbeddableConfig).toHaveBeenCalled()
  })

  it('configures errorTracker', async () => {
    fetchEmbeddableConfig.mockReturnValue(mockWebWidgetConfig)

    await framework.start()

    expect(errorTracker.configure).toHaveBeenCalled()
  })
  it('logs an error to rollbar when failed to fetch embeddable config', async () => {
    const mockError = new Error('Network error')

    jest.spyOn(errorTracker, 'error')

    fetchEmbeddableConfig.mockImplementation(() => {
      throw mockError
    })

    await framework.start()

    expect(errorTracker.error).toHaveBeenCalledWith(mockError, {
      rollbarFingerprint: 'Failed to render embeddable',
      rollbarTitle: 'Failed to render embeddable',
    })
  })

  // Simple helper function to check that mockFunction1 was called before mockFunction2

  describe('when config is for the messenger', () => {
    it('starts the messenger', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

      await framework.start()

      expect(messenger.start).toHaveBeenCalledWith(mockMessengerConfig, 0)
    })

    it('configures ErrorTracker for the Messenger', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockMessengerConfig)

      await framework.start()

      expect(errorTracker.configure).toHaveBeenCalledWith({
        payload: {
          embeddableName: 'messenger',
          environment: 'messenger-test',
        },
      })
    })
  })

  describe('when config is for the web widget', () => {
    it('initialises the web widget', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockWebWidgetConfig)

      await framework.start()

      expect(webWidget.start).toHaveBeenCalledWith(mockWebWidgetConfig, 0)
    })

    it('configures ErrorTracker for the Web Widget', async () => {
      fetchEmbeddableConfig.mockReturnValue(mockWebWidgetConfig)

      await framework.start()

      expect(errorTracker.configure).toHaveBeenCalledWith({
        payload: {
          embeddableName: 'webWidget',
          environment: 'webWidget-test',
        },
      })
    })
  })
})
