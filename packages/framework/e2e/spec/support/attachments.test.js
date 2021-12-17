import launcher from 'e2e/helpers/launcher'
import {
  createTicketSubmissionEndpointResponse,
  waitForSubmissionSuccess,
  uploadFiles,
  mockTicketSubmissionEndpoint,
} from 'e2e/helpers/support-embed'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { queries, wait } from 'pptr-testing-library'

const SUBMISSION_RESPONSE = {
  request: {
    url: 'https://z3nwebwidget2019.zendesk.com/api/v2/requests/250.json',
    id: 250,
    status: 'open',
  },
}

const buildWidget = () => loadWidget().intercept(mockUploadsRequest)

let attachmentId = 0

const attachmentSuccessResponse = (filename, contentType) => {
  attachmentId += 1
  return {
    upload: {
      token: `${filename}-token`,
      expires_at: '2019-12-26T00:08:34Z',
      attachments: [
        {
          url: `https://z3nwebwidget2019.zendesk.com/api/v2/attachments/${attachmentId}.json`,
          id: attachmentId,
          file_name: filename,
          content_url: `https://z3nwebwidget2019.zendesk.com/attachments/token/gA0L0R9bwIvRVeaPu6ZYtAZG4/?name=${filename}`,
          mapped_content_url: `https://z3nwebwidget2019.zendesk.com/attachments/token/gA0L0R9bwIvRVeaPu6ZYtAZG4/?name=${filename}`,
          content_type: contentType,
          size: 21,
          width: null,
          height: null,
          inline: false,
          deleted: false,
          thumbnails: [],
        },
      ],
      attachment: {
        url: `https://z3nwebwidget2019.zendesk.com/api/v2/attachments/${attachmentId}.json`,
        id: attachmentId,
        file_name: filename,
        content_url: `https://z3nwebwidget2019.zendesk.com/attachments/token/gA0L0R9bwIvRVeaPu6ZYtAZG4/?name=${filename}`,
        mapped_content_url: `https://z3nwebwidget2019.zendesk.com/attachments/token/gA0L0R9bwIvRVeaPu6ZYtAZG4/?name=${filename}`,
        content_type: contentType,
        size: 21,
        width: null,
        height: null,
        inline: false,
        deleted: false,
        thumbnails: [],
      },
    },
  }
}

const EXTENSIONS_MAP = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.pages': 'application/x-iwork-pages-sffpages',
  '.numbers': 'application/x-iwork-numbers-sffnumbers',
  '.key': 'application/x-iwork-keynote-sffkey',
}

const mockUploadsRequest = mockCorsRequest('api/v2/uploads', (request) => {
  const url = request.url()
  if (request.method() === 'POST') {
    const filename = url.substring(url.indexOf('filename=') + 9, url.indexOf('&via_id=48'))
    const extension = filename.substr(filename.indexOf('.'))
    const contentType = EXTENSIONS_MAP[extension]
    const response = attachmentSuccessResponse(filename, contentType)
    request.respond({
      status: 201,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'text/plain; charset=UTF-8',
      body: JSON.stringify(response),
    })
  }
})

const submissionPayload = ({ description, name, email, uploads }) => {
  return createTicketSubmissionEndpointResponse(null, { name, email, description, uploads })
}

test('attachments can be uploaded and submitted', async () => {
  const submission = jest.fn()
  await buildWidget()
    .withPresets('contactForm')
    .intercept(mockTicketSubmissionEndpoint(SUBMISSION_RESPONSE, submission))
    .load()
  await launcher.click()

  await uploadFiles(
    'e2e/fixtures/files/text-attachment.txt',
    'e2e/fixtures/files/pdf-attachment.pdf'
  )
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Attachments (2)')).toBeTruthy()
  })
  expect(await queries.queryByText(doc, 'text-attachment.txt')).toBeTruthy()
  expect(await queries.queryByText(doc, 'pdf-attachment.pdf')).toBeTruthy()

  const name = await queries.getByLabelText(doc, 'Your name (optional)')
  await allowsInputTextEditing(name, 'My name')
  const email = await queries.getByLabelText(doc, 'Email address')
  await allowsInputTextEditing(email, 'my@email.com')
  const desc = await queries.getByLabelText(doc, 'How can we help you?')
  await allowsInputTextEditing(desc, 'My description')

  const submitButton = await queries.getByText(doc, 'Send')
  await submitButton.click()

  await waitForSubmissionSuccess()
  expect(submission).toHaveBeenCalledWith(
    submissionPayload({
      description: 'My description',
      uploads: ['text-attachment.txt-token', 'pdf-attachment.pdf-token'],
      name: 'My name',
      email: 'my@email.com',
    })
  )
  await expect(page).toPassAxeTests()
})

test('attachments can be removed from the form', async () => {
  const submission = jest.fn()
  await buildWidget()
    .withPresets('contactForm')
    .intercept(mockTicketSubmissionEndpoint(SUBMISSION_RESPONSE, submission))
    .load()
  await launcher.click()

  await uploadFiles(
    'e2e/fixtures/files/text-attachment.txt',
    'e2e/fixtures/files/json-attachment.json'
  )
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Attachments (2)'))
  await queries.getByText(doc, 'text-attachment.txt')
  await queries.getByText(doc, 'json-attachment.json')
  const closeButtons = await queries.getAllByTestId(doc, 'Icon--close')
  await closeButtons[0].click()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'text-attachment.txt')).toBeNull()
  })
  expect(await queries.queryByText(doc, 'Attachments (1)')).toBeTruthy()
  await closeButtons[1].click()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'json-attachment.json')).toBeNull()
  })
  expect(await queries.queryByText(doc, 'Attachments')).toBeTruthy()

  await uploadFiles('e2e/fixtures/files/doc-attachment.docx')
  await wait(() => queries.getByText(doc, 'Attachments (1)'))

  const email = await queries.getByLabelText(doc, 'Email address')
  await allowsInputTextEditing(email, 'my@email.com')
  const desc = await queries.getByLabelText(doc, 'How can we help you?')
  await allowsInputTextEditing(desc, 'My description')

  const submitButton = await queries.getByText(doc, 'Send')
  await submitButton.click()

  await waitForSubmissionSuccess()
  expect(submission).toHaveBeenCalledWith(
    submissionPayload({
      description: 'My description',
      uploads: ['doc-attachment.docx-token'],
      name: 'My',
      email: 'my@email.com',
    })
  )
  await expect(page).toPassAxeTests()
})

test('attachments too large are rejected', async () => {
  await buildWidget()
    .withPresets('contactForm', {
      embeds: {
        ticketSubmissionForm: {
          props: {
            maxFileSize: 1000000,
          },
        },
      },
    })
    .load()
  await launcher.click()

  await uploadFiles('e2e/fixtures/files/large-attachment.jpg')
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'File too large')).toBeTruthy()
    expect(await queries.queryByText(doc, 'Must be less than 1 MB.')).toBeTruthy()
  })
})

test('can only upload 5 attachments', async () => {
  await buildWidget().withPresets('contactForm').load()
  await launcher.click()

  const doc = await widget.getDocument()
  await uploadFiles(
    'e2e/fixtures/files/text-attachment.txt',
    'e2e/fixtures/files/json-attachment.json',
    'e2e/fixtures/files/doc-attachment.docx',
    'e2e/fixtures/files/numbers-attachment.numbers',
    'e2e/fixtures/files/pages-attachment.pages'
  )
  await wait(() => queries.getByText(doc, 'Attachments (5)'))
  await uploadFiles('e2e/fixtures/files/excel-attachment.xlsx')
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Attachment limit reached')).toBeTruthy()
    expect(
      await queries.queryByText(doc, 'You can upload a maximum of 5 attachments.')
    ).toBeTruthy()
  })
})

const assertIcon = async (filename, icon) => {
  const doc = await widget.getDocument()
  await uploadFiles(`e2e/fixtures/files/${filename}`)
  await wait(async () => {
    expect(await queries.queryByTestId(doc, icon)).toBeTruthy()
  })
  const closeButtons = await queries.getAllByTestId(doc, 'Icon--close')
  await closeButtons[0].click()
  await wait(() => queries.getByText(doc, 'Attachments'))
}

test('displays file type icon', async () => {
  await buildWidget().withPresets('contactForm').load()
  await launcher.click()
  await assertIcon('text-attachment.txt', 'Icon--preview-document')
  await assertIcon('large-attachment.jpg', 'Icon--preview-image')
  await assertIcon('pdf-attachment.pdf', 'Icon--preview-pdf')
  await assertIcon('doc-attachment.docx', 'Icon--preview-document')
  await assertIcon('powerpoint-attachment.pptx', 'Icon--preview-presentation')
  await assertIcon('excel-attachment.xlsx', 'Icon--preview-spreadsheet')
  await assertIcon('keynote-attachment.key', 'Icon--preview-presentation')
  await assertIcon('numbers-attachment.numbers', 'Icon--preview-spreadsheet')
  await assertIcon('pages-attachment.pages', 'Icon--preview-document')
  await assertIcon('json-attachment.json', 'Icon--preview-default')
})
