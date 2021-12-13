import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'
import * as queue from '../setDepartmentQueue'

jest.mock('@zendesk/widget-shared-services/feature-flags')

beforeEach(() => {
  queue.resetDepartmentQueue()
})

describe('onSetDepartmentComplete', () => {
  describe('when department is setting', () => {
    beforeEach(() => {
      queue.setDepartmentPending()
    })

    describe('and the feature is enabled', () => {
      it('does not execute callback immediately', () => {
        const actionsQueueSpy = jest.fn()
        isFeatureEnabled.mockImplementation(() => true)
        queue.onSetDepartmentComplete(actionsQueueSpy)
        expect(actionsQueueSpy).not.toHaveBeenCalled()
      })
    })

    describe('and the feature is not enabled', () => {
      it('does execute callback immediately', () => {
        const actionsQueueSpy = jest.fn()
        isFeatureEnabled.mockImplementation(() => false)

        queue.onSetDepartmentComplete(actionsQueueSpy)
        expect(actionsQueueSpy).toHaveBeenCalled()
      })
    })

    describe('and when department setting completes', () => {
      const callbackSpies = [jest.fn(), jest.fn()]

      it('executes stored callbacks', () => {
        callbackSpies.forEach((callback) => {
          queue.onSetDepartmentComplete(callback)
        })
        queue.setDepartmentComplete()

        callbackSpies.forEach((callback) => {
          expect(callback).toHaveBeenCalled()
        })
      })
    })
  })

  describe('when department is not setting', () => {
    it('executes the callback immediately', () => {
      const callback = jest.fn()

      queue.onSetDepartmentComplete(callback)
      expect(callback).toHaveBeenCalled()
    })
  })
})
