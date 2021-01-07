import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Field, Label, Checkbox } from '@zendeskgarden/react-forms'

import useTranslate from 'src/hooks/useTranslate'
import { getRecordingConsent } from 'embeds/talk/selectors'
import LoadingButton from 'src/embeds/talk/components/LoadingButton'
import { acceptRecordingConsent, declineRecordingConsent } from 'embeds/talk/actions'
import { OPT_IN } from 'embeds/talk/reducers/recording-consent'

import {
  Container,
  Dot,
  DotContainer,
  Heading,
  Message,
  SectionContainer,
  CheckboxContainer
} from './styles'

const ConsentToRecord = ({ onStartCallClicked }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const userConsentedToRecord = useSelector(getRecordingConsent)
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)

  const handleCheck = e => {
    if (e?.target?.checked) {
      dispatch(acceptRecordingConsent())
    } else {
      dispatch(declineRecordingConsent())
    }
  }

  return (
    <Container>
      <SectionContainer>
        <Heading>
          {translate('embeddable_framework.talk.embeddedVoice.recordingConsent.title')}
        </Heading>
        <Message>
          {translate('embeddable_framework.talk.embeddedVoice.recordingConsent.message')}
        </Message>
      </SectionContainer>
      <CheckboxContainer>
        <Field>
          <Checkbox checked={userConsentedToRecord === OPT_IN} onChange={handleCheck}>
            <Label>
              {translate(
                'embeddable_framework.talk.embeddedVoice.recordingConsent.customer.confirmation'
              )}
            </Label>
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
          label={translate('embeddable_framework.talk.embeddedVoice.button.startCall')}
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
