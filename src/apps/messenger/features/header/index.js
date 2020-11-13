import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Header from 'src/apps/messenger/features/sunco-components/Header'
import { getHeaderValues } from './store'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'

import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'

const HeaderWrapper = () => {
  const dispatch = useDispatch()
  const { avatar, name, description } = useSelector(getHeaderValues)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <Header
      title={name}
      description={description}
      avatar={avatar}
      showCloseButton={!isLauncherVisible}
      compact={isFullScreen}
      onClose={() => {
        dispatch(widgetClosed())
      }}
    />
  )
}

export default HeaderWrapper
