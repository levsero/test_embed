import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { snapcallAPI } from 'snapcall'
import { getSnapcallButtonId } from 'src/embeds/talk/selectors'

const useInitSnapcall = () => {
  const buttonId = useSelector(getSnapcallButtonId)
  useEffect(() => {
    snapcallAPI.initWidget(buttonId, { noWidget: true })
  }, [buttonId])
}

export default useInitSnapcall
