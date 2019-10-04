import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@zendeskgarden/react-buttons'
import { IconButton } from './styles'

const HeaderItem = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <IconButton pill={false} ignoreThemeOverride={true} size="small" ref={ref} {...props}>
      <Icon>{children}</Icon>
    </IconButton>
  )
})

HeaderItem.propTypes = {
  children: PropTypes.node
}

export default HeaderItem
