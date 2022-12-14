import FooterView from 'classicSrc/components/Widget/Footer/FooterView'
import ZendeskLogo from 'classicSrc/components/ZendeskLogo'
import { getHideZendeskLogo } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container } from './styles'

const Footer = ({ hideZendeskLogo, children, shadow = true }) => {
  if (!children && hideZendeskLogo) {
    return null
  }

  const justLogo = !children

  return (
    <FooterView shadow={shadow} size={justLogo ? 'small' : 'large'}>
      <Container justLogo={justLogo} justChildren={hideZendeskLogo}>
        {!hideZendeskLogo && <ZendeskLogo />}

        {children}
      </Container>
    </FooterView>
  )
}

Footer.propTypes = {
  hideZendeskLogo: PropTypes.bool,
  shadow: PropTypes.bool,
  children: PropTypes.node,
}

const mapStateToProps = (state) => ({
  hideZendeskLogo: getHideZendeskLogo(state),
})

const connectedComponent = connect(mapStateToProps)(Footer)

export { connectedComponent as default, Footer as Component }
