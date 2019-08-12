import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import CallbackForm from 'src/embeds/talk/components/CallbackForm'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetHeader from 'src/components/WidgetHeader'
import { getTitle } from 'src/embeds/talk/selectors'

const CallbackPage = ({ title }) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{title}</WidgetHeader>

      <CallbackForm />
    </WidgetContainer>
  )
}

CallbackPage.propTypes = {
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  title: getTitle(state, 'embeddable_framework.talk.form.title')
})
export default connect(mapStateToProps)(CallbackPage)
