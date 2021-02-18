import { http } from 'service/transport'

const attachmentSender = (file, doneFn, failFn, progressFn) => {
  const payload = {
    method: 'post',
    path: '/api/v2/uploads',
    file: file,
    callbacks: {
      done: doneFn,
      fail: failFn,
      progress: progressFn,
    },
  }

  return http.sendFile(payload)
}

export default attachmentSender
