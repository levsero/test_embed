import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useModal } from '@zendeskgarden/container-modal'
import { isMobileBrowser } from '@zendesk/widget-shared-services'
import { useCurrentFrame } from '@zendesk/widget-shared-services/Frame'
import { Backdrop, Header, ModalActions, SlideAppear } from './styles'

const ChatModal = ({
  title,
  children,
  onClose,
  focusOnMount,
  'data-testid': testId,
  noPadding,
  animate = true,
}) => {
  const modalRef = useRef(null)
  const frame = useCurrentFrame()
  const { getBackdropProps, getModalProps, getTitleProps, getContentProps } = useModal({
    onClose: (e) => {
      e.stopPropagation()
      onClose()
    },
    modalRef,
    focusOnMount,
    environment: frame.document,
  })

  return (
    <Backdrop {...getBackdropProps()} data-testid={testId}>
      <SlideAppear
        direction="up"
        duration={animate ? 200 : 0}
        startPosHeight="-10px"
        endPosHeight="-5px'"
        transitionOnMount={!isMobileBrowser()}
        noPadding={noPadding}
      >
        <div
          {...getModalProps({
            ref: modalRef,
          })}
        >
          {title && <Header {...getTitleProps()}>{title}</Header>}
          <section {...getContentProps()}>{children}</section>
        </div>
      </SlideAppear>
    </Backdrop>
  )
}

ChatModal.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
  onClose: PropTypes.func,
  focusOnMount: PropTypes.bool,
  'data-testid': PropTypes.string,
  noPadding: PropTypes.bool,
  animate: PropTypes.bool,
}

export default ChatModal

export { ModalActions }
