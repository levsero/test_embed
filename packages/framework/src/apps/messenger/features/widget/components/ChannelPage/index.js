import { useHistory } from 'react-router-dom'
import useTranslate from 'src/hooks/useTranslate'
import { IconButton, BackIcon } from './styles'
import { forwardRef } from 'react'

const ChannelPage = forwardRef((_props, ref) => {
  const history = useHistory()
  const translate = useTranslate()

  return (
    <div ref={ref}>
      <IconButton
        aria-label={translate('embeddable_framework.messenger.channel_linking.back.button')}
        onClick={() => {
          history.goBack()
        }}
      >
        <BackIcon />
      </IconButton>
    </div>
  )
})

export default ChannelPage
