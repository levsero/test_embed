import React from 'react'
import PropTypes from 'prop-types'
import { Label, Value } from '../styles'

const SelectResponse = ({ field }) => {
  return (
    <>
      <Label>{field.label}</Label>

      {field.select?.map(option => {
        return <Value key={option._id}>{option.label}</Value>
      })}
    </>
  )
}

SelectResponse.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    select: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        label: PropTypes.string
      })
    )
  })
}

export default SelectResponse
