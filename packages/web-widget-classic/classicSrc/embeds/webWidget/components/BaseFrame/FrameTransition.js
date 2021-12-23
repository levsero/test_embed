import { FRAME_TRANSITION_DURATION } from 'classicSrc/constants/shared'
import { getHorizontalPosition } from 'classicSrc/redux/modules/selectors'
import {
  getStylingOffset,
  getStylingPositionVertical,
} from 'classicSrc/redux/modules/settings/settings-selectors'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Transition from 'react-transition-group/Transition'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

const useTransitionStyles = () => {
  const horizontalPosition = useSelector(getHorizontalPosition)
  const verticalPosition = useSelector(getStylingPositionVertical)
  const offset = useSelector(getStylingOffset)

  return useMemo(() => {
    const getOffsetPosition = (animationOffset) => {
      const mobileOffset = _.get(offset, 'mobile', {})
      const horizontalOffset = isMobileBrowser()
        ? _.get(mobileOffset, 'horizontal', 0)
        : _.get(offset, 'horizontal', 0)
      const verticalOffset = isMobileBrowser()
        ? _.get(mobileOffset, 'vertical', 0)
        : _.get(offset, 'vertical', 0)

      return {
        [horizontalPosition]: horizontalOffset,
        [verticalPosition]: parseInt(verticalOffset) + animationOffset,
      }
    }

    return {
      entering: {
        opacity: 0,
        ...getOffsetPosition(0),
      },
      entered: {
        opacity: 1,
        ...getOffsetPosition(0),
      },
      exiting: {
        opacity: 0,
        ...getOffsetPosition(-20),
      },
      exited: {
        opacity: 0,
        top: '-9999px',
        visibility: 'hidden',
      },
    }
  }, [offset, horizontalPosition, verticalPosition])
}

const FrameTransition = ({ visible, children, onEntered }) => {
  const transitionStyles = useTransitionStyles()

  const baseStyles = {
    transitionDuration: `${FRAME_TRANSITION_DURATION}ms`,
    transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    transitionProperty: 'opacity, top, bottom',
  }

  return (
    <Transition
      in={visible}
      timeout={FRAME_TRANSITION_DURATION}
      onEntered={onEntered}
      appear={true}
    >
      {(status) => children({ ...baseStyles, ...transitionStyles[status] })}
    </Transition>
  )
}

FrameTransition.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.func,
  onEntered: PropTypes.func,
}

export default FrameTransition
