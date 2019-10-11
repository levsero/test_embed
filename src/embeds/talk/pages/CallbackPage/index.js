import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CallbackForm from 'src/embeds/talk/components/CallbackForm'
import { Widget, Header } from 'src/components/Widget'
import { getTitle } from 'src/embeds/talk/selectors'

const CallbackPage = ({ title }) => {
  return (
    <Widget>
      <Header title={title} />
      <CallbackForm />
    </Widget>
  )
}

CallbackPage.propTypes = {
  title: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  title: getTitle(state, 'embeddable_framework.talk.form.title')
})

export default connect(mapStateToProps)(CallbackPage)
