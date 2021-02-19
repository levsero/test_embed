import PropTypes from 'prop-types'
import { Field, Label } from '@zendeskgarden/react-forms'
import { Input } from './styles'

const NameField = ({ label, defaultValue }) => {
  return (
    <Field>
      <Label dangerouslySetInnerHTML={{ __html: label }} />
      <Input defaultValue={defaultValue} name="name" />
    </Field>
  )
}

NameField.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
}

export default NameField
