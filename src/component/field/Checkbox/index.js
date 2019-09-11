import React from 'react'
import PropTypes from 'prop-types'
import {
  Field,
  Checkbox as GardenCheckbox,
  Label as CheckboxLabel,
  Hint as CheckboxHint,
  Message
} from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'constants/shared'

const Checkbox = ({ label, description, showError, errorString, checkboxProps }) => {
  return (
    <Field>
      <GardenCheckbox {...checkboxProps} data-testid={TEST_IDS.CHECKBOX_FIELD}>
        <CheckboxLabel dangerouslySetInnerHTML={{ __html: label }} />
        {description && <CheckboxHint>{description}</CheckboxHint>}
        {showError && <Message validation="error">{errorString}</Message>}
      </GardenCheckbox>
    </Field>
  )
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  showError: PropTypes.bool.isRequired,
  errorString: PropTypes.string,
  checkboxProps: PropTypes.shape({
    checked: PropTypes.oneOf([0, 1]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool
  })
}

export default Checkbox
