import PropTypes from 'prop-types'
import styled from 'styled-components'
import Title from 'components/Widget/Header/Title'
import HeaderRow from 'components/Widget/Header/HeaderRow'

const HEADER_ICON_SIZE = 2

const TitleRow = styled(HeaderRow)`
  display: flex;
  align-content: stretch;
  align-items: center;
  min-height: ${HEADER_ICON_SIZE}rem;

  ${Title} {
    &:first-child {
      margin-left: ${2 * HEADER_ICON_SIZE}rem;
    }

    &:nth-child(2) {
      margin-left: ${HEADER_ICON_SIZE}rem;
    }

    &:last-child {
      margin-right: ${2 * HEADER_ICON_SIZE}rem;
    }

    &:nth-last-child(2) {
      margin-right: ${HEADER_ICON_SIZE}rem;
    }
  }
`

TitleRow.propTypes = {
  children: PropTypes.node,
}

export default TitleRow
