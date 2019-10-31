import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FooterView from 'components/Widget/Footer/FooterView'
import ZendeskLogo from 'components/ZendeskLogo'
import { Container } from './styles'
import { getHideZendeskLogo } from 'src/redux/modules/selectors'

const Footer = ({ hideZendeskLogo, children }) => {
  if (!children && hideZendeskLogo) {
    return null
  }

  const justLogo = !children

  return (
    <FooterView shadow={true} size={justLogo ? 'small' : 'large'}>
      <Container justLogo={justLogo} justChildren={hideZendeskLogo}>
        {!hideZendeskLogo && <ZendeskLogo />}

        {children}
      </Container>
    </FooterView>
  )
}

Footer.propTypes = {
  hideZendeskLogo: PropTypes.bool,
  children: PropTypes.node
}

const mapStateToProps = state => ({
  hideZendeskLogo: getHideZendeskLogo(state)
})

const connectedComponent = connect(mapStateToProps)(Footer)

export { connectedComponent as default, Footer as Component }
