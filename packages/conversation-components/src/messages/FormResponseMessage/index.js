import PropTypes from 'prop-types'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import FieldResponse from './FieldResponse'

import { FormContainer, Field } from './styles'

const FormResponseMessage = ({ fields, isFirstInGroup, label, avatar }) => {
  return (
    <OtherParticipantLayout isFirstInGroup={isFirstInGroup} avatar={avatar} label={label}>
      <FormContainer>
        {fields.map(field => (
          <Field key={field._id}>
            <FieldResponse field={field} />
          </Field>
        ))}
      </FormContainer>
    </OtherParticipantLayout>
  )
}

FormResponseMessage.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      text: PropTypes.string
    })
  ),
  avatar: PropTypes.string,
  label: PropTypes.string,
  isFirstInGroup: PropTypes.bool
}

export default FormResponseMessage
