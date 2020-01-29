import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import useTranslate from 'src/hooks/useTranslate'
import { Label } from '@zendeskgarden/react-forms'

const ContactFormLabel = ({ value, required, as }) => {
  const translate = useTranslate()
  const sanitizedLabel = sanitizeHtml(value, { allowedTags: [] })

  const requiredLabel = `<strong>${sanitizedLabel}</strong>`

  const LabelComponent = as || Label

  return (
    <LabelComponent
      dangerouslySetInnerHTML={{
        __html: required
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
  as: PropTypes.elementType
}

export default ContactFormLabel
