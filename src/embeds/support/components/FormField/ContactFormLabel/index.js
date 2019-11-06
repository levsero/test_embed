import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import useTranslation from 'src/hooks/useTranslation'
import { Label } from '@zendeskgarden/react-forms'

const ContactFormLabel = ({ value, required, as }) => {
  const sanitizedLabel = sanitizeHtml(value, { allowedTags: [] })
  const optionalValue = useTranslation('embeddable_framework.validation.label.new_optional', {
    label: sanitizedLabel
  })

  const requiredLabel = `<strong>${sanitizedLabel}</strong>`

  const LabelComponent = as || Label

  return (
    <LabelComponent
      dangerouslySetInnerHTML={{ __html: required ? requiredLabel : optionalValue }}
    />
  )
}

ContactFormLabel.propTypes = {
  value: PropTypes.string,
  required: PropTypes.bool,
  as: PropTypes.elementType
}

export default ContactFormLabel
