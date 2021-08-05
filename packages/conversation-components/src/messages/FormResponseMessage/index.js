import PropTypes from 'prop-types'
import { MESSAGE_STATUS } from 'src/constants'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import PrimaryParticipantLayout from '../../layouts/PrimaryParticipantLayout'
import FieldResponse from './FieldResponse'
import { FormContainer, Field } from './styles'

const FormResponseMessage = ({
  avatar,
  label,
  fields,
  timeReceived,
  status = 'sent',
  isPrimaryParticipant = false,
  isFirstInGroup = true,
  isReceiptVisible = true,
  isFreshMessage = true,
  onRetry = () => {},
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout

  return (
    <Layout
      isFirstInGroup={isFirstInGroup}
      avatar={avatar}
      label={label}
      onRetry={onRetry}
      timeReceived={timeReceived}
      isReceiptVisible={isReceiptVisible}
      status={status}
      isFreshMessage={isFreshMessage}
    >
      <FormContainer>
        {fields.map((field) => (
          <Field key={field._id}>
            <FieldResponse field={field} />
          </Field>
        ))}
      </FormContainer>
    </Layout>
  )
}

FormResponseMessage.propTypes = {
  avatar: PropTypes.string,
  label: PropTypes.string,
  isPrimaryParticipant: PropTypes.bool,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  timeReceived: PropTypes.number,
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onRetry: PropTypes.func,
}

export default FormResponseMessage
