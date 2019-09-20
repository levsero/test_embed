import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { Button } from '@zendeskgarden/react-buttons'

import { HeaderTitle, TicketFormOption } from './styles'
import WidgetContainer from 'src/components/WidgetContainer'
import WidgetMain from 'src/components/WidgetMain'
import WidgetHeader from 'src/components/WidgetHeader'

import * as selectors from 'src/redux/modules/submitTicket/submitTicket-selectors'
import { getContactFormTitle } from 'src/redux/modules/selectors'
import { getSelectTicketFormLabel } from 'src/redux/modules/selectors'

const mapStateToProps = state => ({
  ticketForms: selectors.getTicketForms(state),
  selectTicketFormLabel: getSelectTicketFormLabel(state),
  formTitle: getContactFormTitle(state)
})

const TicketFormsPage = ({
  formTitle,
  selectTicketFormLabel,
  ticketForms,
  handleFormOptionClick
}) => {
  return (
    <WidgetContainer>
      <WidgetHeader>{formTitle}</WidgetHeader>
      <WidgetMain>
        <HeaderTitle>{selectTicketFormLabel}</HeaderTitle>
        {_.map(ticketForms, form => {
          return (
            <TicketFormOption key={form.id}>
              <Button link={true} data-id={form.id} onClick={handleFormOptionClick}>
                {form.display_name}
              </Button>
            </TicketFormOption>
          )
        })}
      </WidgetMain>
    </WidgetContainer>
  )
}

TicketFormsPage.propTypes = {
  selectTicketFormLabel: PropTypes.string.isRequired,
  ticketForms: PropTypes.array.isRequired,
  handleFormOptionClick: PropTypes.func.isRequired,
  formTitle: PropTypes.string.isRequired
}

const ConnectedComponent = connect(mapStateToProps)(TicketFormsPage)

export { ConnectedComponent as default, TicketFormsPage as Component }
