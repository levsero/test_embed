import attachmentSender from 'embeds/support/utils/attachment-sender'
import { http } from 'service/transport'

jest.mock('service/transport', () => ({
  http: { sendFile: jest.fn() },
}))

describe('attachmentSender', () => {
  it('uploads the file', () => {
    const file = 'file'
    const doneFn = jest.fn()
    const failFn = jest.fn()
    const progressFn = jest.fn()

    attachmentSender(file, doneFn, failFn, progressFn)

    expect(http.sendFile).toHaveBeenCalledWith({
      method: 'post',
      path: '/api/v2/uploads',
      file: file,
      callbacks: {
        done: doneFn,
        fail: failFn,
        progress: progressFn,
      },
    })
  })
})
