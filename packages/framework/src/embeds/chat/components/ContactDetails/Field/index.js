import PropTypes from 'prop-types'

import { Field as GardenField, Label, Input, Message } from '@zendeskgarden/react-forms'

import useSafeState from 'src/hooks/useSafeState'

import { renderLabel } from 'src/util/fields'
import useTranslate from 'src/hooks/useTranslate'
import { Field } from './styles'

const ContactDetailField = ({
  isAuthenticated,
  isRequired,
  label,
  name,
  testId,
  shouldFocusOnMount = false,
}) => {
  const translate = useTranslate()
  const [hasFocused, setHasFocused] = useSafeState(false)

  return (
    <Field
      name={name}
      render={({ input, meta }) => (
        <GardenField>
          {renderLabel(Label, translate(label), isRequired)}
          <Input
            value={input.value}
            name={input.name}
            disabled={isAuthenticated}
            validation={meta.error ? 'error' : undefined}
            onChange={(value) => input.onChange(value)}
            ref={(ref) => {
              if (shouldFocusOnMount && !hasFocused)
                setTimeout(() => {
                  ref?.focus()
                  setHasFocused(true)
                }, 0)
            }}
            data-testid={testId}
          />
          {meta.error && <Message validation="error">{translate(meta.error)}</Message>}
        </GardenField>
      )}
    />
  )
}

ContactDetailField.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  shouldFocusOnMount: PropTypes.bool,
}

export default ContactDetailField
