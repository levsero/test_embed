import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'
import { connect } from 'react-redux'
import { getZendeskLogoLink } from './selectors'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'

import LogoIcon from 'icons/widget-icon_zendesk.svg'

const ZendeskLogo = ({ href, hideZendeskLogo = false }) => {
  if (hideZendeskLogo) {
    return null
  }

  return (
    <a href={href} target="_blank" tabIndex="-1" className={styles.icon}>
      <LogoIcon title="zendesk" />
    </a>
  )
}

ZendeskLogo.propTypes = {
  href: PropTypes.string.isRequired,
  hideZendeskLogo: PropTypes.bool
}

const mapStateToProps = (state, props) => {
  return {
    href: getZendeskLogoLink(state, props.linkToChat),
    hideZendeskLogo: getHideZendeskLogo(state)
  }
}

const connectedComponent = connect(mapStateToProps)(ZendeskLogo)

export { connectedComponent as default, ZendeskLogo as Component }
