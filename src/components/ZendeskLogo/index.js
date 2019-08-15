import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import { connect } from 'react-redux'
import { getZendeskLogoLink } from './selectors'

import LogoIcon from 'icons/widget-icon_zendesk.svg'

const ZendeskLogo = ({ href }) => (
  <a href={href} target="_blank" tabIndex="-1" className={styles.icon}>
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
