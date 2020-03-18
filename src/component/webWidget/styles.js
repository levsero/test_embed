import styled from 'styled-components'
import PropTypes from 'prop-types'

const WidgetContainer = styled.div`
  height: ${props =>
    props.isFullHeight ? '100%' : `calc(100% - ${15 / props.theme.fontSize}rem)`};
`

WidgetContainer.propTypes = {
  isFullHeight: PropTypes.bool
}

export { WidgetContainer }
