import { Dropzone } from 'classicSrc/component/Dropzone'
import { MAX_WIDGET_HEIGHT, WIDGET_WIDTH } from 'classicSrc/constants/shared'
import { TEST_IDS } from 'classicSrc/constants/shared'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { locals as styles } from './AttachmentBox.scss'
import { Container, DropzoneChild, DropzoneChildLabel, PaperclipIcon } from './AttachmentBoxStyles'

const dropzoneMargin = 19 // the frames border and padding

const AttachmentBox = ({
  dimensions = { width: WIDGET_WIDTH, height: MAX_WIDGET_HEIGHT },
  onDragLeave = () => {},
  onDrop,
}) => {
  const translate = useTranslate()
  const style = {
    width: `${dimensions.width - dropzoneMargin}px`,
    height: `${dimensions.height - dropzoneMargin}px`,
  }
  const dropzoneContainerStyles = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
  }

  return (
    <Container>
      <Dropzone
        onDrop={onDrop}
        className={styles.dropzone}
        activeClassName={styles.dropzoneActive}
        style={style}
        containerStyle={dropzoneContainerStyles}
        onDragLeave={onDragLeave}
      >
        <DropzoneChild>
          <PaperclipIcon data-testid={TEST_IDS.ICON_PAPERCLIP_LARGE} />
          <DropzoneChildLabel>
            {translate('embeddable_framework.common.attachments.dragdrop')}
          </DropzoneChildLabel>
        </DropzoneChild>
      </Dropzone>
    </Container>
  )
}

AttachmentBox.propTypes = {
  dimensions: PropTypes.object,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func.isRequired,
}

export default AttachmentBox
