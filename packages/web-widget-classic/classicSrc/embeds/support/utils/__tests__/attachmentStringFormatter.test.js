import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { formatNameString, secondaryText, formatAttachmentSize } from '../attachmentStringFormatter'

describe('formatNameString', () => {
  it('handles shorter strings', () => {
    const result = formatNameString('filename.jpg')

    expect(result).toEqual('filename.jpg')
  })

  it('abbreviates long strings', () => {
    const result = formatNameString('filenames_longer_than_30_chars_are_abbreviated.jpg')

    expect(result).toEqual('filenames_longer_than_…ted.jpg')
  })
})

describe('secondaryText', () => {
  it('displays an uploading message while the attachment is uploading', () => {
    const result = secondaryText(30, true, i18n.t)

    expect(result).toEqual('Uploading...')
  })

  it('renders filesize when not uploading', () => {
    const result = secondaryText(30, false, i18n.t)

    expect(result).toEqual('1 KB')
  })
})

describe('formatAttachmentSize', () => {
  it('under 1kb rounds to 1KB', () => {
    const result = formatAttachmentSize(30, i18n.t)

    expect(result).toEqual('1 KB')
  })

  it('rounds to nearest KB over 1kb', () => {
    const result = formatAttachmentSize(3232, i18n.t)

    expect(result).toEqual('3 KB')
  })

  it('rounds to nearest .1 of MB over 1MB', () => {
    const result = formatAttachmentSize(3623254, i18n.t)

    expect(result).toEqual('3.6 MB')
  })
})
