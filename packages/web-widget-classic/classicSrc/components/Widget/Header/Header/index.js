import PropTypes from 'prop-types'
import BackButton from 'classicSrc/components/Widget/Header/BackButton'
import CloseButton from 'classicSrc/components/Widget/Header/CloseButton'
import HeaderView from 'classicSrc/components/Widget/Header/HeaderView'
import Title from 'classicSrc/components/Widget/Header/Title'
import TitleRow from 'classicSrc/components/Widget/Header/TitleRow'
import { TEST_IDS } from 'classicSrc/constants/shared'

const Header = ({ children, title, useReactRouter, showBackButton, showCloseButton }) => (
  <HeaderView data-testid={TEST_IDS.WIDGET_HEADER_VIEW}>
    <TitleRow>
      {showBackButton && <BackButton useReactRouter={useReactRouter} />}
      <Title id={'widgetHeaderTitle'}>{title}</Title>
      {showCloseButton && <CloseButton />}
    </TitleRow>
    {children}
  </HeaderView>
)

Header.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  useReactRouter: PropTypes.bool.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  showCloseButton: PropTypes.bool.isRequired,
}

Header.defaultProps = {
  title: '',
  useReactRouter: false,
  showTitle: true,
  showBackButton: true,
  showCloseButton: true,
}

export default Header
