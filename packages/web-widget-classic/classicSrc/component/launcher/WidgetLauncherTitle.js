import PropTypes from 'prop-types'
import { useEffect } from 'react'

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
