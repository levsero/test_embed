import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FRAME_TRANSITION_DURATION } from 'constants/shared'
import Transition from 'react-transition-group/Transition'
import { getHorizontalPosition } from 'src/redux/modules/selectors'
import {
  getStylingOffset,
  getStylingPositionVertical
} from 'src/redux/modules/settings/settings-selectors'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { isMobileBrowser } from 'utility/devices'

const useTransitionStyles = () => {
  const horizontalPosition = useSelector(getHorizontalPosition)
  const verticalPosition = useSelector(getStylingPositionVertical)
  const offset = useSelector(getStylingOffset)

  return useMemo(() => {
    const getOffsetPosition = animationOffset => {
      const mobileOffset = _.get(offset, 'mobile', {})
      const horizontalOffset = isMobileBrowser()
        ? _.get(mobileOffset, 'horizontal', 0)
        : _.get(offset, 'horizontal', 0)
      const verticalOffset = isMobileBrowser()
        ? _.get(mobileOffset, 'vertical', 0)
        : _.get(offset, 'vertical', 0)

      return {
        [horizontalPosition]: horizontalOffset,
        [verticalPosition]: parseInt(verticalOffset) + animationOffset
      }
    }

    return {
      entering: {
        opacity: 0,
        ...getOffsetPosition(-20)
      },
      entered: {
        opacity: 1,
        ...getOffsetPosition(0)
      },
      exiting: {
        opacity: 0,
        ...getOffsetPosition(-20)
      },
      exited: {
        top: '-9999px',
        visibility: 'hidden'
      }
    }
  }, [offset, horizontalPosition, verticalPosition])
}

const FrameTransition = ({ visible, children, onEntered }) => {
  const transitionStyles = useTransitionStyles()

  const baseStyles = {
    transitionDuration: `${FRAME_TRANSITION_DURATION}ms`,
    transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    transitionProperty: 'opacity, top, bottom'
  }

  return (
    <Transition
      in={visible}
      timeout={FRAME_TRANSITION_DURATION}
      onEntered={onEntered}
      appear={true}
    >
      {status => children({ ...baseStyles, ...transitionStyles[status] })}
    </Transition>
  )
}

FrameTransition.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.func,
  onEntered: PropTypes.func
}

export default FrameTransition