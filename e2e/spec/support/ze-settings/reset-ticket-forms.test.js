import { createField, createForm, mockTicketFormsEndpoint } from 'e2e/helpers/support-embed'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import launcher from 'e2e/helpers/launcher'

test('load with with default form, update to show single ticket form then reset back to default form', async () => {
  const description = createField({
    id: 1,
    title_in_portal: 'Custom description',
    type: 'description'
  })

  const { mockFormsResponse, form } = createForm({
    name: 'Custom form',
    id: 123,
    fields: [description]
  })

  await loadWidget()
    .withPresets('contactForm')
    .intercept(mockTicketFormsEndpoint(mockFormsResponse))
    .load()

  await launcher.click()

  await widget.waitForText('How can we help you?')

  await page.evaluate(formId => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        contactForm: {
          ticketForms: [{ id: formId }]
        }
      }
    })
  }, form.id)

  // Widget does not update while still open
  await widget.expectToSeeText('How can we help you?')

  await widget.clickClose()
  await launcher.click()

  await widget.waitForText('Custom description')
  await widget.expectNotToSeeText('How can we help you?')

  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        contactForm: {
          ticketForms: []
        }
      }
    })
  })

  await widget.expectToSeeText('Custom description')
  await widget.expectNotToSeeText('How can we help you?')

  await widget.clickClose()
  await launcher.click()

  await widget.waitForText('How can we help you?')
})

test('load with with default form, update to show multiple ticket forms then reset back to default form', async () => {
  const option1 = createForm({
    name: 'Custom form 1',
    id: 123
  })
  const option2 = createForm({
    name: 'Custom form 2',
    id: 456
  })

  await loadWidget()
    .withPresets('contactForm')
    .intercept(
      mockTicketFormsEndpoint({
        ticket_forms: [
          ...option1.mockFormsResponse.ticket_forms,
          ...option2.mockFormsResponse.ticket_forms
        ],
        ticket_fields: [
          ...option1.mockFormsResponse.ticket_fields,
          ...option2.mockFormsResponse.ticket_fields
        ]
      })
    )
    .load()

  await launcher.click()

  await widget.waitForText('How can we help you?')

  await page.evaluate(
    (formId1, formId2) => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: formId1 }, { id: formId2 }]
          }
        }
      })
    },
    option1.form.id,
    option2.form.id
  )

  // Widget does not update while still open
  await widget.expectToSeeText('How can we help you?')

  await widget.clickClose()
  await launcher.click()

  await widget.waitForText('Please select your issue')

  await widget.expectNotToSeeText('How can we help you?')
  await widget.expectToSeeText('Custom form 1')
  await widget.expectToSeeText('Custom form 2')

  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        contactForm: {
          ticketForms: []
        }
      }
    })
  })

  // Widget updates straight away if on the form list page, since the user isn't currently typing into a form
  await widget.expectToSeeText('How can we help you?')
  await widget.expectNotToSeeText('Custom form 1')
  await widget.expectNotToSeeText('Custom form 2')
})

test('load with three custom forms, update to show only two custom forms then reset back to all forms', async () => {
  const option1 = createForm({
    name: 'Custom form 1',
    id: 123
  })
  const option2 = createForm({
    name: 'Custom form 2',
    id: 456
  })
  const option3 = createForm({
    name: 'Custom form 3',
    id: 789
  })

  const mockConfigWithForm = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketFormsEnabled: true
        }
      }
    }
  }

  await loadWidget()
    .withPresets('contactForm', mockConfigWithForm)
    .intercept(
      mockTicketFormsEndpoint({
        ticket_forms: [
          ...option1.mockFormsResponse.ticket_forms,
          ...option2.mockFormsResponse.ticket_forms,
          ...option3.mockFormsResponse.ticket_forms
        ],
        ticket_fields: [
          ...option1.mockFormsResponse.ticket_fields,
          ...option2.mockFormsResponse.ticket_fields,
          ...option3.mockFormsResponse.ticket_fields
        ]
      })
    )
    .load()

  await launcher.click()

  await widget.waitForText('Custom form 1')
  await widget.waitForText('Custom form 2')
  await widget.waitForText('Custom form 3')

  await page.evaluate(
    (formId1, formId2) => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: formId1 }, { id: formId2 }]
          }
        }
      })
    },
    option1.form.id,
    option2.form.id
  )

  await widget.expectToSeeText('Custom form 1')
  await widget.expectToSeeText('Custom form 2')
  await widget.expectNotToSeeText('Custom form 3')

  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        contactForm: {
          ticketForms: []
        }
      }
    })
  })

  await widget.expectToSeeText('Custom form 1')
  await widget.expectToSeeText('Custom form 2')
  await widget.expectToSeeText('Custom form 3')
})
