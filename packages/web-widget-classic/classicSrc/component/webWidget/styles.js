import PropTypes from 'prop-types'
import styled from 'styled-components'

const WidgetContainer = styled.div`
  height: 100%;
  padding: ${(props) => (props.isFullHeight ? 0 : `${16 / props.theme.fontSize}rem`)};
`

WidgetContainer.propTypes = {
  isFullHeight: PropTypes.bool,
}

export { WidgetContainer }
