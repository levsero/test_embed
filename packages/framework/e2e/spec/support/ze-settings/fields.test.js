import launcher from 'e2e/helpers/launcher'
import { mockTicketFormsEndpoint, createField, createForm } from 'e2e/helpers/support-embed'
import { assertInputValue } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'

describe('zESettings.webWidget.contactForm.fields', () => {
  test('prefill using zESettings', async () => {
    const description = createField({ id: 1, type: 'description' })
    const subject = createField({ id: 2, type: 'subject' })
    const text = createField({ id: 3, type: 'text' })
    const textarea = createField({ id: 4, type: 'textarea' })
    const integer = createField({ id: 5, type: 'integer' })
    const decimal = createField({ id: 6, type: 'decimal' })
    const { mockFormsResponse, embedConfig } = createForm({
      name: 'Test form',
      id: 123,
      fields: [description, subject, text, textarea, integer, decimal],
    })
    await loadWidget()
      .withPresets('contactForm', {
        embeds: {
          ticketSubmissionForm: {
            props: embedConfig,
          },
        },
      })
      .intercept(mockTicketFormsEndpoint(mockFormsResponse))
      .evaluateOnNewDocument(
        (textId, textAreaId, integerId, decimalId) => {
          window.zESettings = {
            webWidget: {
              contactForm: {
                fields: [
                  { id: 'description', prefill: { '*': 'Prefill description' } },
                  { id: 'subject', prefill: { '*': 'Prefill subject' } },
                  { id: textId, prefill: { '*': 'random text' } },
                  { id: textAreaId, prefill: { '*': 'gibberish' } },
                  { id: integerId, prefill: { '*': '456' } },
                  { id: decimalId, prefill: { '*': '456.08' } },
                ],
              },
            },
          }
        },
        text.id,
        textarea.id,
        integer.id,
        decimal.id
      )
      .load()

    await launcher.click()
    const doc = await widget.getDocument()
    await wait(async () => queries.getByText(doc, 'Test form'))
    await assertInputValue('Title for field 1', 'Prefill description')
    await assertInputValue(`Title for field ${subject.id}`, 'Prefill subject')
    await assertInputValue(`Title for field ${text.id}`, 'random text')
    await assertInputValue(`Title for field ${textarea.id}`, 'gibberish')
    await assertInputValue(`Title for field ${integer.id}`, '456')
    await assertInputValue(`Title for field ${decimal.id}`, '456.08')
  })

  test('prefill respects locale', async () => {
    const subject = createField({ id: 1, title_in_portal: 'Subject', type: 'subject' })
    const text = createField({ id: 2, title_in_portal: 'Text', type: 'text' })
    const { mockFormsResponse, embedConfig } = createForm({
      name: 'Test form',
      id: 123,
      fields: [subject, text],
    })
    await loadWidget()
      .withPresets('contactForm', {
        embeds: {
          ticketSubmissionForm: {
            props: embedConfig,
          },
        },
      })
      .intercept(mockTicketFormsEndpoint(mockFormsResponse))
      .evaluateOnNewDocument((textId) => {
        window.zESettings = {
          webWidget: {
            contactForm: {
              fields: [
                { id: 'subject', prefill: { '*': 'Prefill subject', fr: 'french prefill' } },
                { id: textId, prefill: { '*': 'random text', fr: 'french random' } },
              ],
            },
          },
        }
      }, text.id)
      .load()
    await page.evaluate(() => {
      zE('webWidget', 'setLocale', 'fr')
    })

    await launcher.click()
    const doc = await widget.getDocument()
    await wait(async () => await queries.getByText(doc, 'Laissez-nous un message'))
    await assertInputValue('Subject', 'french prefill')
    await assertInputValue('Text', 'french random')
  })
})
