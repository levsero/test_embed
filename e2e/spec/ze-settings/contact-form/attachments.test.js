import { queries } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

describe('zESettings.webWidget.contactForm.attachments', () => {
  const queryAttachments = async attachments => {
    await widgetPage.loadWithConfig('contactForm')

    await page.evaluate(attachments => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          contactForm: {
            attachments
          }
        }
      })
    }, attachments)
    await launcher.click()
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