import { useDispatch } from 'react-redux'
import { fileUploadCountLimit } from 'messengerSrc/constants'
import { sendFile } from 'messengerSrc/features/messageLog/store'

const useSendFiles = () => {
  const dispatch = useDispatch()

  const onFilesSelected = (files) => {
    Array.from(files).forEach((file, index) => {
      dispatch(sendFile({ file, failDueToTooMany: index >= fileUploadCountLimit }))
    })
  }

  return {
    onFilesSelected,
  }
}

export default useSendFiles
