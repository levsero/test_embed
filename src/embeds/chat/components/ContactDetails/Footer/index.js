import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@zendeskgarden/react-buttons'
import { Footer, FooterItem } from '@zendeskgarden/react-modals'

import { TEST_IDS } from 'constants/shared'
import useTranslate from 'src/hooks/useTranslate'

import { Dots } from './styles'

const FormFooter = ({ isAuthenticated, submitting, updateContactDetailsVisibility }) => {
  const translate = useTranslate()
  return (
    <Footer>
      <FooterItem>
        <Button
          onClick={() => updateContactDetailsVisibility(false)}
          data-testid={TEST_IDS.BUTTON_CANCEL}
          ref={ref => {
            if (isAuthenticated) ref?.focus()
          }}
        >
          {translate('embeddable_framework.common.button.cancel')}
        </Button>
      </FooterItem>
      {!isAuthenticated && (
        <FooterItem>
          <Button
            primary={true}
            type="submit"
            disabled={submitting}
            data-testid={TEST_IDS.BUTTON_OK}
          >
            {submitting ? (
              <div data-testid={TEST_IDS.DOTS}>
                <Dots delayMS={125} />
              </div>
            ) : (
              translate('embeddable_framework.common.button.save')
            )}
          </Button>
        </FooterItem>
      )}
    </Footer>
  )
}

FormFooter.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  updateContactDetailsVisibility: PropTypes.func.isRequired
}

export default FormFooter
