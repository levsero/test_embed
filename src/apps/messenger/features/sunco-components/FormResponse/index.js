import React from 'react'
import PropTypes from 'prop-types'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'

import { FormContainer, Field, Label } from './styles'

const SuncoFormResponseMessage = ({ fields, isFirstInGroup, label, avatar }) => {
  return (
    <OtherParticipantLayout isFirstInGroup={isFirstInGroup} avatar={avatar} label={label}>
      <FormContainer>
        {fields.map((field, index) => {
          const isLastField = index === fields.length - 1

          return (
            <Field key={field._id} isLastField={isLastField}>
              <Label>{field.label}</Label>
              {field.text}
            </Field>
          )
        })}
      </FormContainer>
    </OtherParticipantLayout>
  )
}

SuncoFormResponseMessage.propTypes = {
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

export default SuncoFormResponseMessage
