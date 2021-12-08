import * as libphonenumber from 'libphonenumber-js'

const getFormattedPhoneNumber = (number) => {
  return libphonenumber.format(libphonenumber.parse(number), 'International')
}

export default getFormattedPhoneNumber
