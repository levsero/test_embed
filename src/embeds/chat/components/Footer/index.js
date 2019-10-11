import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import Footer from 'src/components/Widget/Footer'
import ZendeskLogo from 'src/components/ZendeskLogo'
import { Button } from '@zendeskgarden/react-buttons'
import { TEST_IDS } from 'src/constants/shared'

const ChatFooter = ({ hideZendeskLogo, onClick, label }) => {
  return (
    <Footer scrollShadowVisible={true}>
      <div className={!hideZendeskLogo ? styles.footerContentMultiple : null}>
        {!hideZendeskLogo && <ZendeskLogo />}
        <Button
          primary={true}
          onClick={onClick}
          type="submit"
          data-testid={TEST_IDS.CHAT_START}
          className={styles.button}
        >
          {label}
        </Button>
      </div>
    </Footer>
  )
}

ChatFooter.propTypes = {
  hideZendeskLogo: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string
}

ChatFooter.defaultProps = {
  hideZendeskLogo: false,
  onClick: () => {},
  label: ''
}

export default ChatFooter
