import styled from 'styled-components'
import PropTypes from 'prop-types'
import { isPopout } from 'utility/globals'

const WidgetContainer = styled.div`
  height: ${props =>
    props.isFullHeight ? '100%' : `calc(100% - ${15 / props.theme.fontSize}rem)`};

  padding: ${props => (props.theme.isMobile || isPopout() ? 0 : '0 10px')};
`

WidgetContainer.propTypes = {
  isFullHeight: PropTypes.bool
}

export { WidgetContainer }
