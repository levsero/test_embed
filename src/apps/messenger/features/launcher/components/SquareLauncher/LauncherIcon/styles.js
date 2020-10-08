import styled, { css } from 'styled-components'
import { bezierCurve } from 'src/apps/messenger/constants'

const animatedDuration = 0.5

const Icon = styled.div`
  position: absolute;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  transition: top ${animatedDuration}s ${bezierCurve};

  ${props => {
    if (props.state === 'entering' || props.state === 'entered') {
      return css`
        top: 0;
      `
    }

    return css`
      top: ${props.hiddenPosition};
    `
  }}
`

export { Icon, animatedDuration }
