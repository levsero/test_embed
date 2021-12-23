import { acceptRecordingConsent, declineRecordingConsent } from 'classicSrc/embeds/talk/actions'
import LoadingButton from 'classicSrc/embeds/talk/components/LoadingButton'
import { OPT_IN } from 'classicSrc/embeds/talk/reducers/recording-consent'
import { getRecordingConsent } from 'classicSrc/embeds/talk/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Field, Label, Checkbox } from '@zendeskgarden/react-forms'
import {
  Container,
  Dot,
  DotContainer,
  Heading,
  Message,
  SectionContainer,
  CheckboxContainer,
} from './styles'

const ConsentToRecord = ({ onStartCallClicked }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const userConsentedToRecord = useSelector(getRecordingConsent)
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)

  const handleCheck = (e) => {
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
  onStartCallClicked: PropTypes.func.isRequired,
}

export default ConsentToRecord
