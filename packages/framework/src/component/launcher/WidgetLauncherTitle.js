import { useEffect } from 'react'
import PropTypes from 'prop-types'

const WidgetLauncherTitle = ({ title, onTitleChange }) => {
  useEffect(() => {
    onTitleChange(title)
  }, [title])

  return null
}

WidgetLauncherTitle.propTypes = {
  title: PropTypes.string,
  onTitleChange: PropTypes.func,
}

export default WidgetLauncherTitle
