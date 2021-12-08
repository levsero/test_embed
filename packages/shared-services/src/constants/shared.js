// Email regular expression from http://emailregex.com/
export const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
export const PHONE_PATTERN = /^(?=.*[0-9]+).{1,25}$/
export const NAME_PATTERN = /^.{1,255}$/
