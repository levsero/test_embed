import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Attachment from 'src/embeds/support/components/Attachment'
import AttachmentError from 'src/embeds/support/components/AttachmentError'
import { ICONS, FILETYPE_ICONS } from 'constants/shared'
import { deleteAttachment } from 'src/embeds/support/actions/index'
import { getAllAttachments } from 'src/embeds/support/selectors'

const AttachmentList = ({ allAttachments, deleteAttachment }) => {
  return allAttachments.map(attachment => {
    const { id, fileName } = attachment

    if (!fileName) return null

    if (attachment.errorMessage) {
      return (
        <AttachmentError
          key={id}
          attachment={attachment}
          handleRemoveAttachment={deleteAttachment}
        />
      )
    }

    const extension = fileName
      .split('.')
      .pop()
      .toUpperCase()
    const icon = FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT
    return (
      <Attachment
        key={id}
        attachment={attachment}
        handleRemoveAttachment={deleteAttachment}
        icon={icon}
      />
    )
  })
}

AttachmentList.propTypes = {
  allAttachments: PropTypes.array.isRequired,
  deleteAttachment: PropTypes.func.isRequired
}

const actionCreators = {
  deleteAttachment
}

const mapStateToProps = state => ({
  allAttachments: getAllAttachments(state)
})

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(AttachmentList)

export { connectedComponent as default, AttachmentList as Component }
