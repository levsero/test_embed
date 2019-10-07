import { wait } from 'pptr-testing-library'

/*
  For testing that user-input text is maliable in HTML input elements.
  This seems stupid, but it catches the elusive React bug that popped
  up in this ticket: https://support.zendesk.com/agent/tickets/4863667
*/
export const allowsInputTextEditing = async inputField => {
  inputField.focus()
  await page.keyboard.type('Hello!!')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.type(' world')

  await wait(async () => {
    const searchFieldValue = await inputField.getProperty('value')

    expect(await searchFieldValue.jsonValue()).toBe('Hello world!!')
  })
}
