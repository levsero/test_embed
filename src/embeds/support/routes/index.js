const routes = {
  home: () => '/support',
  form: id => `/support/ticketForm/${id || ':id'}`,
  list: () => '/support/ticketFormsList',
  success: () => '/support/success',
  defaultFormId: 'contact-form'
}

export default routes
