import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from './styles'

const HeaderItem = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <IconButton isPill={false} ignoreThemeOverride={true} size="small" ref={ref} {...props}>
      {children}
    </IconButton>
  )
})

HeaderItem.propTypes = {
  children: PropTypes.node
}

export default HeaderItem
