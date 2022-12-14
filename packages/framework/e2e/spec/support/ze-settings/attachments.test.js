import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'

describe('zESettings.webWidget.contactForm.attachments', () => {
  const queryAttachments = async (attachments) => {
    await loadWidget()
      .withPresets('contactForm')
      .evaluateAfterSnippetLoads((attachments) => {
        zE('webWidget', 'updateSettings', {
          webWidget: {
            contactForm: {
              attachments,
            },
          },
        })
      }, attachments)
      .load()
    await launcher.click()
    await widget.waitForText('Leave us a message')
    return await queries.queryByText(await widget.getDocument(), 'Attachments')
  }

  it('displays the attachments field when not set', async () => {
    const header = await queryAttachments(undefined)
    expect(header).toBeTruthy()
  })

  it('displays the attachments field when set to any truthy value', async () => {
    const header = await queryAttachments('truthy')

    expect(header).toBeTruthy()
  })

  it('hides the attachments field when set to false', async () => {
    const header = await queryAttachments(false)

    expect(header).toBe(null)
  })

  it('hides the attachments field when set to any falsy value', async () => {
    const header = await queryAttachments(0)

    expect(header).toBe(null)
  })
})
