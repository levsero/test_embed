import styled from 'styled-components'
import PropTypes from 'prop-types'
import { isMobileBrowser } from 'utility/devices'

const WidgetContainer = styled.div`
  height: ${props =>
    props.isFullHeight ? '100%' : `calc(100% - ${15 / props.theme.fontSize}rem)`};
  padding: ${isMobileBrowser() ? 0 : '0 10px'};
`

WidgetContainer.propTypes = {
  isFullHeight: PropTypes.bool
}

export { WidgetContainer }
