import styled from 'styled-components'

const DayList = styled.dl`
  font-size: ${props => 15 / props.theme.fontSize}rem;
  margin: ${props => 16 / props.theme.fontSize}rem 0;
`

const DayName = styled.dt`
  font-size: ${props => 15 / props.theme.fontSize}rem;
  font-weight: bold;
  padding-bottom: ${props => 4 / props.theme.fontSize}rem;
`

const LastTiming = styled.dd`
  padding-bottom: ${props => 12 / props.theme.fontSize}rem;
`

const Hours = styled.dd`
  ${props => props.lastTiming && `margin-bottom: ${12 / props.theme.fontSize}rem;`}
`

export { DayList, DayName, LastTiming, Hours }
