import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FileDropProvider } from 'components/FileDropProvider'
import LoadingPage from 'components/LoadingPage'
import { Widget, Header } from 'components/Widget'
import TicketForm from 'embeds/support/components/TicketForm'
import routes from 'embeds/support/routes'
import {
  getContactFormTitle,
  getFormsToDisplay,
  getCanDisplayForm,
  getIsFormLoading,
  getIsAnyTicketFormLoading,
} from 'embeds/support/selectors'
import { dragStarted } from 'src/embeds/support/actions'

const TicketFormPage = ({
  formTitle,
  formId,
  amountOfCustomForms = 0,
  formExists,
  isLoading,
  isPreview,
  isAnyTicketFormLoading,
}) => {
  const history = useHistory()
  const canRedirect = useRef(true)

  useEffect(() => {
    if (!canRedirect.current) {
      return
    }

    if (formId === routes.defaultFormId && amountOfCustomForms > 0) {
      return history.replace(routes.home())
    }

    if (formId !== routes.defaultFormId && amountOfCustomForms === 0) {
      return history.replace(routes.home())
    }

    if (formId !== routes.defaultFormId && !formExists) {
      return history.replace(routes.home())
    }

    // Redirects from this component should only happen on first render, to not navigate away from form
    // while widget is open.
    // However, forms are fetched on mount of the Support embed. So if currently fetching forms, allow redirect to
    // happen once forms have stopped loading.
    if (!isAnyTicketFormLoading) {
      canRedirect.current = false
    }
  }, [amountOfCustomForms, formExists, formId, history, isAnyTicketFormLoading])

  if (isLoading || (canRedirect.current && isAnyTicketFormLoading)) {
    return <LoadingPage />
  }

  return (
    <FileDropProvider>
      <Widget>
        <Header title={formTitle} useReactRouter={amountOfCustomForms > 1} />

        <TicketForm formId={formId} isPreview={isPreview} />
      </Widget>
    </FileDropProvider>
  )
}

TicketFormPage.propTypes = {
  formTitle: PropTypes.string,
  formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.shape({}),
  amountOfCustomForms: PropTypes.number,
  formExists: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isPreview: PropTypes.bool,
  isAnyTicketFormLoading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const { params } = ownProps.match
  const id = params.id

  return {
    formId: id,
    formTitle: getContactFormTitle(state),
    amountOfCustomForms: getFormsToDisplay(state).length,
    formExists: Boolean(id === routes.defaultFormId || getCanDisplayForm(state, id)),
    isLoading: getIsFormLoading(state, id),
    isAnyTicketFormLoading: getIsAnyTicketFormLoading(state),
  }
}

const actionCreators = {
  dragStarted,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(TicketFormPage)

export { connectedComponent as default, TicketFormPage as Component }
