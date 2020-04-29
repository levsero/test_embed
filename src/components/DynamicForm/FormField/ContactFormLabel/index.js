import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import useTranslate from 'src/hooks/useTranslate'
import { Label } from '@zendeskgarden/react-forms'

const ContactFormLabel = ({ fieldId, value, required, isReadOnly, as }) => {
  const translate = useTranslate()

  const sanitizedLabel = sanitizeHtml(value, { allowedTags: [] })
  const requiredLabel = `<strong>${sanitizedLabel}</strong>`

  const LabelComponent = as || Label
  const showRequiredLabel = required || isReadOnly

  return (
    <LabelComponent
      data-fieldid={fieldId}
      dangerouslySetInnerHTML={{
        __html: showRequiredLabel
          ? requiredLabel
          : translate('embeddable_framework.validation.label.new_optional', {
              label: sanitizedLabel
            })
      }}
    />
  )
}

ContactFormLabel.propTypes = {
  value: PropTypes.string,
  required: PropTypes.bool,
  as: PropTypes.elementType,
  fieldId: PropTypes.any,
  isReadOnly: PropTypes.bool
}

export default ContactFormLabel
