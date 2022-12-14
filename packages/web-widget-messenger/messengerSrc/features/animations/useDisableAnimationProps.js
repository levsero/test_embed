import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { win } from '@zendesk/widget-shared-services'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'

const useShouldDisableAnimations = () => {
  const animationsDisabled = useSelector((state) =>
    isFeatureEnabled(state, 'web_widget_messenger_animations_disabled')
  )

  const [reduceMotion, setReduceMotion] = useState(
    Boolean(win.matchMedia('(prefers-reduced-motion: reduce)').matches)
  )

  useEffect(() => {
    const reduceMotionQuery = win.matchMedia('(prefers-reduced-motion: reduce)')

    const onChange = (event) => {
      setReduceMotion(Boolean(event.matches))
    }

    if (reduceMotionQuery.addEventListener) {
      // For browsers that support modern matchMedia syntax
      reduceMotionQuery.addEventListener('change', onChange)
    } else if (reduceMotionQuery.addListener) {
      // For browsers that only support deprecated matchMedia syntax
      reduceMotionQuery.addListener(onChange)
    }

    return () => {
      if (reduceMotionQuery.removeEventListener) {
        // For browsers that support modern matchMedia syntax
        reduceMotionQuery.removeEventListener('change', onChange)
      } else if (reduceMotionQuery.removeListener) {
        // For browsers that only support deprecated matchMedia syntax
        reduceMotionQuery.removeListener(onChange)
      }
    }
  }, [])

  return Boolean(animationsDisabled || reduceMotion)
}

const useDisableAnimationProps = () => {
  const shouldDisableAnimations = useShouldDisableAnimations()

  return useMemo(() => {
    const props = {}
    if (shouldDisableAnimations) {
      props['data-disable-animations'] = true
    }
    return props
  }, [shouldDisableAnimations])
}

export { useShouldDisableAnimations }
export default useDisableAnimationProps
