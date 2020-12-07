import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Field, Label, Checkbox } from '@zendeskgarden/react-forms'

import {
  Container,
  Dot,
  DotContainer,
  Heading,
  Message,
  SectionContainer,
  CheckboxContainer
} from './styles'
import LoadingButton from 'src/embeds/talk/components/LoadingButton'

const ConsentToRecord = ({ onStartCallClicked }) => {
  const [isConsentSelected, setIsConsentSelected] = useState(true)
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)

  return (
    <Container>
      <SectionContainer>
        <Heading>Allow call to be recorded?</Heading>
        <Message>If you consent, the call will be recorded for quality purposes.</Message>
      </SectionContainer>
      <CheckboxContainer>
        <Field>
          <Checkbox
            checked={isConsentSelected}
            onChange={() => setIsConsentSelected(!isConsentSelected)}
          >
            <Label>I consent to this call being recorded</Label>
          </Checkbox>
        </Field>
      </CheckboxContainer>
      <SectionContainer>
        <LoadingButton
          isPrimary={true}
          onClick={(...args) => {
            setIsEstablishingCall(true)
            onStartCallClicked(...args)
          }}
          isLoading={isEstablishingCall}
          label="Start Call"
        />
        <DotContainer>
          <Dot />
          <Dot isActive={true} />
        </DotContainer>
      </SectionContainer>
    </Container>
  )
}

ConsentToRecord.propTypes = {
  onStartCallClicked: PropTypes.func.isRequired
}

export default ConsentToRecord
