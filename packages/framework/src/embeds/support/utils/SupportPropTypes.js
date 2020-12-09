import PropTypes from 'prop-types'

// conditions are the user provided conditions, that define if a field should be conditionally shown when another field
// equals a certain value.
// https://support.zendesk.com/hc/en-us/articles/360022293573-Creating-conditional-ticket-fields-in-Zendesk-Support-Professional-add-on-and-Enterprise-
const conditions = PropTypes.arrayOf(
  PropTypes.shape({
    parent_field_id: PropTypes.number,
    value: PropTypes.any,
    child_fields: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        is_required: PropTypes.bool
      })
    )
  })
)

const ticketField = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  keyID: PropTypes.string,
  title_in_portal: PropTypes.string,
  type: PropTypes.string
})

const readOnlyState = PropTypes.objectOf(PropTypes.bool)

const SupportPropTypes = {
  ticketField,
  conditions,
  readOnlyState
}

export default SupportPropTypes
