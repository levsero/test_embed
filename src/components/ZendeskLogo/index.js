import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { getZendeskLogoLink } from './selectors'
import { TEST_IDS } from 'src/constants/shared'
import LogoIcon from 'icons/widget-icon_zendesk.svg'

import { locals as styles } from './styles.scss'

const ZendeskLogo = ({ href }) => (
  <a
    data-testid={TEST_IDS.ICON_ZENDESK}
    href={href}
    target="_blank"
    tabIndex="-1"
    className={styles.icon}
  >
    <LogoIcon title="zendesk" />
  </a>
)

ZendeskLogo.propTypes = {
  href: PropTypes.string.isRequired
}

const mapStateToProps = (state, props) => ({
  href: getZendeskLogoLink(state, props.linkToChat)
})

const connectedComponent = connect(mapStateToProps)(ZendeskLogo)

export { connectedComponent as default, ZendeskLogo as Component }
