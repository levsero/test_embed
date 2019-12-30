import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import { queries } from 'pptr-testing-library'

describe('name field is disabled', () => {
  it('does not include name field in form', async () => {
    await loadWidget()
      .withPresets('contactForm', {
        embeds: {
          ticketSubmissionForm: {
            props: {
              nameFieldEnabled: false
            }
          }
        }
      })
      .load()
    await launcher.click()
    await waitForContactForm()
    const doc = await widget.getDocument()
    const name = await queries.queryByLabelText(doc, 'Your name (optional)')
    expect(name).toBeNull()
  })
})

describe('default config', () => {
  it('includes name field in form as optional', async () => {
    await loadWidget()
      .withPresets('contactForm')
      .load()
    await launcher.click()
    await waitForContactForm()
    const doc = await widget.getDocument()
    const name = await queries.queryByLabelText(doc, 'Your name (optional)')
    expect(name).toBeTruthy()
  })
})

describe('name field is enabled and required', () => {
  it('includes name field in form and marks it as required', async () => {
    await loadWidget()
      .withPresets('contactForm', {
        embeds: {
          ticketSubmissionForm: {
            props: {
              nameFieldEnabled: true,
              nameFieldRequired: true
            }
          }
        }
      })
      .load()
    await launcher.click()
    await waitForContactForm()
    const doc = await widget.getDocument()
    const name = await queries.queryByLabelText(doc, 'Your name')
    expect(name).toBeTruthy()
    const frame = await widget.getFrame()
    await expect(frame).toFillForm('form', {
      email: 'sdf@afasdf.com',
      description: 'hello world'
    })
    await expect(frame).toClick('button', { text: 'Send' })
    await expect(frame).toMatch('Please enter a valid name')
  })
})
