import styled from 'styled-components'
import PropTypes from 'prop-types'

const WidgetContainer = styled.div`
  height: 100%;
  padding: ${(props) => (props.isFullHeight ? 0 : `${16 / props.theme.fontSize}rem`)};
`

WidgetContainer.propTypes = {
  isFullHeight: PropTypes.bool,
}

export { WidgetContainer }
