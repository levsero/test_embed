import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useModal } from '@zendeskgarden/container-modal'
import { Backdrop, Header, ModalActions, SlideAppear } from './styles'
import { isMobileBrowser } from 'utility/devices'
import { useCurrentFrame } from 'components/Frame'

const ChatModal = ({ title, children, onClose, focusOnMount, 'data-testid': testId }) => {
  const modalRef = useRef(null)
  const frame = useCurrentFrame()
  const { getBackdropProps, getModalProps, getTitleProps, getContentProps } = useModal({
    onClose: e => {
      e.stopPropagation()
      onClose()
    },
    modalRef,
    focusOnMount,
    environment: frame.document
  })

  return (
    <Backdrop {...getBackdropProps()} data-testid={testId}>
      <SlideAppear
        direction="up"
        duration={200}
        startPosHeight="-10px"
        endPosHeight="-5px'"
        transitionOnMount={!isMobileBrowser()}
      >
        <div
          {...getModalProps({
            ref: modalRef
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
  'data-testid': PropTypes.string
}

export default ChatModal

export { ModalActions }
