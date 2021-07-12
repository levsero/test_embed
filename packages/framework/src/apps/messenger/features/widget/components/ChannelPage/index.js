import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'

import {
  linkIntegration,
  selectIntegrationById,
  getIsFetchingLinkRequest,
  getErrorFetchingLinkRequest,
  getHasFetchedLinkRequest,
} from 'src/apps/messenger/store/integrations'

import ChannelLink from './components/ChannelLink'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const integration = useSelector((state) => selectIntegrationById(state, channelId))
  const isFetchingLinkRequest = useSelector(getIsFetchingLinkRequest)
  const errorFetchingLinkRequest = useSelector(getErrorFetchingLinkRequest)
  const hasFetchedLinkRequest = useSelector(getHasFetchedLinkRequest)

  useEffect(() => {
    dispatch(linkIntegration(channelId))
  }, [])

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

      {!hasFetchedLinkRequest && isFetchingLinkRequest && <div>Loading link request</div>}
      {!hasFetchedLinkRequest && errorFetchingLinkRequest && <div>Error fetching link request</div>}

      {hasFetchedLinkRequest && (
        <ChannelLink
          channelId={channelId}
          url={integration.linkRequest.url}
          qrCode={integration.linkRequest.qrCode}
        />
      )}
    </div>
  )
})

export default ChannelPage
