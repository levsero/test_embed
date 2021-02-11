import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledPreviewer = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;

  align-items: ${props => (props.position === 'left' ? 'flex-start' : 'flex-end')};

  height: ${props => props.height}px;
  width: ${props => (props.width ? `${props.width}px` : 'auto')};
  padding: 16px;

  > *:not(:first-child) {
    margin-top: 8px;
  }
`

const Previewer = props => {
  return <StyledPreviewer {...props} />
}

Previewer.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  height: PropTypes.number,
  width: PropTypes.number
}

Previewer.defaultProps = {
  height: 772,
  width: 380
}

export default Previewer
