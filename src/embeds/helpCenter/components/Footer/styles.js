import styled from 'styled-components'
import PropTypes from 'prop-types'

export const Container = styled.div`
  ${({ hideZendeskLogo }) =>
    hideZendeskLogo &&
    `
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
 `}
`

Container.propTypes = {
  hideZendeskLogo: PropTypes.bool.isRequired
}
