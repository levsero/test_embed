import { fireEvent, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import * as suncoClient from 'messengerSrc/api/sunco'
import * as messageLogStore from 'messengerSrc/features/messageLog/store'
import { render } from 'messengerSrc/utils/testHelpers'
import { SUPPORTED_FILE_TYPES } from '@zendesk/sunco-js-client'
import { updateFeatures } from 'src/embeds/webWidget/selectors/feature-flags'
import Footer from '../'
import { startTyping } from '../typing'

jest.mock('messengerSrc/api/sunco')
jest.mock('../typing')

// react testing library seems to have a bug where when you type, the first letter appears last
// e.g. typing "testing" would result in "estingt"
// a simple workaround is to type a few things first before typing the thing we actually want
const stuffToWriteToFixInputBug = '{space}{selectall}{backspace}'

describe('Footer', () => {
  const defaultProps = { isComposerEnabled: true }

  const renderComponent = (props = {}, options) => {
    return render(<Footer {...defaultProps} {...props} />, options)
  }

  it('submits when the user hits enter', async () => {
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    await userEvent.type(input, `${stuffToWriteToFixInputBug}message from user`)

    await waitFor(() => expect(queryByText('message from user')).toBeInTheDocument())
    await userEvent.type(input, '{enter}')

    await waitFor(() =>
      expect(suncoClient.sendMessage).toHaveBeenCalledWith(
        'message from user',
        undefined,
        undefined
      )
    )
    await waitFor(() => expect(queryByText('message from user')).not.toBeInTheDocument())
  })

  it('does not submit an empty text message', () => {
    const { getByLabelText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, '   ')
    userEvent.type(input, '{enter}')

    expect(suncoClient.sendMessage).not.toHaveBeenCalled()
  })

  it('submits when the user clicks the Send button', () => {
    const { getByLabelText, queryByText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, `${stuffToWriteToFixInputBug}message from user`)

    expect(queryByText('message from user')).toBeInTheDocument()

    userEvent.click(getByLabelText('Send message'))

    expect(suncoClient.sendMessage).toHaveBeenCalledWith('message from user', undefined, undefined)
    expect(queryByText('message from user')).not.toBeInTheDocument()
  })

  it('calls startTyping on every key change', () => {
    const { getByLabelText } = renderComponent()
    const input = getByLabelText('Type a message')

    userEvent.type(input, 'message from user')

    expect(startTyping).toHaveBeenCalled()

    startTyping.mockReset()

    userEvent.type(input, '{backspace}')

    expect(startTyping).toHaveBeenCalled()
  })

  it('persists the text when you close and re-open the widget', async () => {
    const first = renderComponent()

    await userEvent.type(
      first.getByLabelText('Type a message'),
      `${stuffToWriteToFixInputBug}message from user`
    )

    await waitFor(() =>
      expect(first.getByLabelText('Type a message')).toHaveValue('message from user')
    )

    first.unmount()

    const second = renderComponent(undefined, { store: first.store })

    await waitFor(() =>
      expect(second.getByLabelText('Type a message')).toHaveValue('message from user')
    )
  })

  describe('when file uploads arturo is enabled', () => {
    beforeEach(() => {
      updateFeatures({ messengerFileUploads: true })
    })

    afterEach(() => {
      updateFeatures({})
    })

    it('renders the file attachment button', () => {
      const { getByLabelText } = renderComponent()

      expect(getByLabelText('Upload file')).toBeInTheDocument()
    })

    it('limits what files can be uploaded', () => {
      renderComponent()

      expect(document.querySelector('input')).toHaveAttribute('accept', SUPPORTED_FILE_TYPES)
    })

    it('attempts to send each file that is selected', () => {
      jest.spyOn(messageLogStore, 'sendFile')

      renderComponent()
      fireEvent.change(document.querySelector('input'), {
        target: { files: ['file-one.pdf', 'file-two.jpg'] },
      })

      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: 'file-one.pdf',
        failDueToTooMany: false,
      })
      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: 'file-two.jpg',
        failDueToTooMany: false,
      })
    })

    it('has a limit of 25 files at a time', () => {
      const files = new Array(30)
        .fill(null)
        .map((_, index) => ({ name: `file-${index}.png`, type: 'image/png' }))

      jest.spyOn(messageLogStore, 'sendFile')

      renderComponent()
      fireEvent.change(document.querySelector('input'), {
        target: { files },
      })

      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: files[0],
        failDueToTooMany: false,
      })
      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: files[15],
        failDueToTooMany: false,
      })
      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: files[24],
        failDueToTooMany: false,
      })
      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: files[25],
        failDueToTooMany: true,
      })
      expect(messageLogStore.sendFile).toHaveBeenCalledWith({
        file: files[26],
        failDueToTooMany: true,
      })
    })
  })

  describe('when file uploads arturo is not enabled', () => {
    beforeEach(() => {
      updateFeatures({ messengerFileUploads: false })
    })

    afterEach(() => {
      updateFeatures({})
    })

    it('does not render the file attachment button', () => {
      const { queryByLabelText } = renderComponent()

      expect(queryByLabelText('Upload file')).not.toBeInTheDocument()
    })
  })
})
