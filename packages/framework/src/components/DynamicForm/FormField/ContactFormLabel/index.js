import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import useTranslate from 'src/hooks/useTranslate'
import { FormLabel } from './styles'

const getShouldShowWithOptionalLabel = (required, isReadOnly, isPreview) => {
  if (required) {
    return false
  }

  if (isReadOnly && !isPreview) {
    return false
  }

  return true
}

const ContactFormLabel = ({ fieldId, value, required, as, isReadOnly, isPreview }) => {
  const translate = useTranslate()

  const sanitizedLabel = sanitizeHtml(value, { allowedTags: [] })
  const requiredLabel = `<strong>${sanitizedLabel}</strong>`
  const optionalLabel = translate('embeddable_framework.validation.label.new_optional', {
    label: sanitizedLabel
  })

  return (
    <FormLabel as={as} data-fieldid={fieldId}>
      <div
        dangerouslySetInnerHTML={{
          __html: getShouldShowWithOptionalLabel(required, isReadOnly, isPreview)
            ? optionalLabel
            : requiredLabel
        }}
      />
    </FormLabel>
  )
}

ContactFormLabel.propTypes = {
  value: PropTypes.string,
  required: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isPreview: PropTypes.bool,
  as: PropTypes.elementType,
  fieldId: PropTypes.any
}

export default ContactFormLabel
