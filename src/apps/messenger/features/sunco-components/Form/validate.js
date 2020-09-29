const validate = (fields, values) => {
  const errors = {}

  fields.forEach(field => {
    const value = values[field._id]

    if (!value) {
      errors[field._id] = 'This field is required'
    }
  })

  return errors
}

export default validate
