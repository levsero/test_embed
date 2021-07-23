import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'
import { Footer, FooterItem } from '@zendeskgarden/react-modals'
import SubmitButton from 'src/components/DynamicForm/SubmitButton'
import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'

const FormFooter = ({ isAuthenticated, submitting, updateContactDetailsVisibility }) => {
  const translate = useTranslate()
  return (
    <Footer>
      <FooterItem>
        <Button
          onClick={() => updateContactDetailsVisibility(false)}
          data-testid={TEST_IDS.BUTTON_CANCEL}
          ref={(ref) => {
            if (isAuthenticated) ref?.focus()
          }}
        >
          {translate('embeddable_framework.common.button.cancel')}
        </Button>
      </FooterItem>
      {!isAuthenticated && (
        <FooterItem>
          <SubmitButton
            submitting={submitting}
            label={translate('embeddable_framework.common.button.save')}
          />
        </FooterItem>
      )}
    </Footer>
  )
}

FormFooter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  updateContactDetailsVisibility: PropTypes.func.isRequired,
}

export default FormFooter
