import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'

import { linkIntegration } from 'src/apps/messenger/store/integrations'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(linkIntegration(channelId))
  }, [])

  /*
  useSelector((state) => state.integrations.entities[channelId].linkRequest.url)
  */

  return (
    <div ref={ref}>
      <p>
        <button
          onClick={() => {
            history.goBack()
          }}
        >
          Back
        </button>
      </p>
      <div>Hellooooo</div>
      <p>{`Channel Page with ID = ${channelId}`}</p>
    </div>
  )
})

export default ChannelPage
