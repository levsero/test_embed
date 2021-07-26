import { render, fireEvent } from '@testing-library/react'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import { http } from 'src/service/transport/http'
import HelpCenterArticle from '../index'

const renderComponent = (props) => {
  const mergedProps = {
    isMobile: false,
    imagesSender: noop,
    updateStoredImages: noop,
    storedImages: {},
    ...props,
  }

  return render(<HelpCenterArticle {...mergedProps} />)
}

const activeArticle = {
  id: 1,
  locale: 'en-us',
  body: `
    <h1 id="foo">Foobar</h1>
    <h2 name="1">Baz</h2>
    <a href="#foo">inpage link</a>
    <a href="#1">inpage link 2</a>
    <a id="relative" class="relative" name="bar" href="/relative/link">relative link</a>
    <a id="protocol-relative" class="protocol-relative" name="pbar" href="//youtube/embed/xyz">protcol relative link</a>
    <div id="preserved" style="bad styles not allowed">
      This text contains a sub-note<sub>1</sub>
    </div>
    <div id="notes"><sup>1</sup>This explains the note</div>
    <table>
      <tr>
        <td><p>Zombocom</p>
      </tr>
    </table>
    <p>Whoa!</p>
    <table>
      <tr>
        <td>OMGWTFBBQ!!1! wat? another table? but why??</td>
      </tr>
    </table>
  `,
}

test('renders the expected classes', () => {
  http.getDynamicHostname = () => 'testingHost'
  const { container } = renderComponent({ activeArticle })

  expect(container).toMatchSnapshot()
})

test('renders the expected mobile classes', () => {
  const { container } = renderComponent({ activeArticle, isMobile: true })

  expect(container).toMatchSnapshot()
})

test('removes the \\n between start and end tags', () => {
  const article = {
    id: 1,
    locale: 'en-us',
    body: '<ul>\n<li>\n<p>One</p></li>\n<li>Two</li>\n</ul>',
  }
  const { container } = renderComponent({ activeArticle: article })

  expect(container.innerHTML).toMatch('<ul><li><p>One</p></li><li>Two</li></ul>')
})

test('when the article has ordered lists the start and end are preserved', () => {
  const article = {
    id: 1,
    locale: 'en-us',
    body: `
      <ol start="4" reversed="reversed">
      <li>six</li>
      <li>five</li>
      <li>four</li>
      </ol>
    `,
  }
  const { container } = renderComponent({ activeArticle: article })
  const list = container.querySelector('ol')

  expect(list.start).not.toBeNull
  expect(list.reversed).not.toBeNull
})

test('when an inline link is clicked, the element is scrolled into view', () => {
  const scrollIntoView = jest.fn()
  const { getByText } = renderComponent({ activeArticle })

  window.HTMLElement.prototype.scrollIntoView = scrollIntoView
  fireEvent.click(getByText('inpage link'))
  expect(scrollIntoView).toHaveBeenCalled()
})

describe('clicking article links', () => {
  test('when an external link is clicked, the link attributes rel and target are set', () => {
    const { getByText } = renderComponent({ activeArticle })
    const link = getByText('relative link')

    fireEvent.click(link)
    expect(link.target).toEqual('_blank')
    expect(link.rel).toEqual('noopener noreferrer')
  })

  test('when the article mailto link, the protocol is preserved and target is not set to _blank', () => {
    const article = {
      id: 1,
      locale: 'en-us',
      body: '<a name="mailto" href="mailto:bob@example.com">mailto link</a>',
    }
    const { getByText } = renderComponent({ activeArticle: article })
    const link = getByText('mailto link')

    expect(link.target).toEqual('')
    expect(link.href).toBe('mailto:bob@example.com')
  })

  test('displays an empty article body if a prop was passed with no content body', () => {
    const article = { body: '' }
    const { container } = renderComponent({ activeArticle: article })

    expect(container.querySelector('.article').innerHTML).toEqual('')
  })
})

describe('iframe', () => {
  describe('valid urls', () => {
    ;[
      'https://player.vimeo.com/video/fooid',
      '//fast.wistia.net/embed/iframe/0kpsylzz9j',
      'https://youtube.com/embed/fooid',
      '//players.brightcove.net/fooid',
      '//play.vidyard.com/fooid.html',
      '//content.jwplatform.com/players/fooid.html',
      '//screencast.com/users/fooid',
      '//www.loom.com/embed/fooid',
    ].forEach((src) => {
      test(`${src} gets the expected iframe tag with stripped attrs`, () => {
        const article = {
          id: 1,
          locale: 'en-us',
          body: `<iframe height="320px" width="480px" allowfullscreen src="${src}" />`,
        }
        const { container } = renderComponent({ activeArticle: article })
        const iframe = container.querySelector('iframe')

        expect(iframe.outerHTML).toEqual(`<iframe src="${src}" allowfullscreen=""></iframe>`)
      })
    })
  })

  describe('invalid urls', () => {
    ;[
      'https://yoVutube.com/embed/fooid',
      '//fast.wiStia.net/embed/iframe/0kpsylzz9j',
      '.com',
      'https://player.notvimeo.com/video/fooid',
      'https://content.jpmorgan.com/players/fooid.html',
      '//screenfast.com/users/fooid',
    ].forEach((src) => {
      test(`${src} are stripped out of the article`, () => {
        const article = {
          id: 1,
          locale: 'en-us',
          body: `<iframe height="320px" width="480px" allowfullscreen src="${src}" />`,
        }
        const { container } = renderComponent({ activeArticle: article })

        expect(container.querySelector('iframe')).not.toBeInTheDocument()
      })
    })
  })
})

test('does not render original article button if it renderOriginalArticleButton is false', () => {
  const { queryByTitle } = renderComponent({
    originalArticleButton: false,
    activeArticle,
  })

  expect(queryByTitle('View original article')).not.toBeInTheDocument()
})

describe('article images', () => {
  it('does not inject the locale in the image url if not authenticated', () => {
    jest.spyOn(baseSelectors, 'getBaseIsAuthenticated').mockReturnValue(false)
    const article = {
      id: 1,
      locale: 'en-us',
      body: '<img alt="img" src="https://dev.zd-dev.com/hc/article_attachments/img1.png" />',
    }
    const { getByAltText } = renderComponent({ activeArticle: article })

    expect(getByAltText('img').src).toEqual(
      'https://dev.zd-dev.com/hc/article_attachments/img1.png'
    )
  })

  describe('baseIsAuthenticated', () => {
    it('queues up new images with locale in the image url', () => {
      http.getDynamicHostname = () => 'dev.zd-dev.com'
      jest.spyOn(baseSelectors, 'getBaseIsAuthenticated').mockReturnValue(true)
      const article = {
        id: 1,
        locale: 'en-us',
        body: `<img src="https://dev.zd-dev.com/hc/article_attachments/img1.png" />
        <img src="https://dev.zd-dev.com/hc/article_attachments/img2.png" />
        `,
      }
      const imagesSender = jest.fn(),
        updateStoredImages = jest.fn()

      renderComponent({
        imagesSender,
        updateStoredImages,
        activeArticle: article,
      })
      expect(imagesSender).toHaveBeenCalledWith(
        'https://dev.zd-dev.com/hc/en-us/article_attachments/img1.png',
        expect.any(Function)
      )
      expect(imagesSender).toHaveBeenCalledWith(
        'https://dev.zd-dev.com/hc/en-us/article_attachments/img2.png',
        expect.any(Function)
      )

      window.URL.createObjectURL = jest.fn().mockReturnValue('hello')
      const successFn = imagesSender.mock.calls[0][1]
      const mockRes = {
        xhr: {
          response: new window.Blob([''], { type: 'image/png' }),
        },
      }

      successFn(mockRes)
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockRes.xhr.response)
      expect(updateStoredImages).toHaveBeenCalledWith({
        'https://dev.zd-dev.com/hc/en-us/article_attachments/img1.png': 'hello',
      })
    })

    it('replaces article image urls in the stored images property', () => {
      jest.spyOn(baseSelectors, 'getBaseIsAuthenticated').mockReturnValue(true)
      const storedImages = {
        'https://localhost/hc/en-us/article_attachments/img0.png': 'https://localhost/abc/img0.png',
        'https://localhost/hc/en-us/article_attachments/img1.png': 'https://localhost/abc/img1.png',
      }
      const { getByAltText } = renderComponent({
        storedImages,
        activeArticle: {
          body: `
          <img alt="img1" src="https://localhost/hc/en-us/article_attachments/img0.png" />
          <img alt="img2" src="https://localhost/hc/en-us/article_attachments/img1.png" />
          `,
        },
      })

      expect(getByAltText('img1').src).toEqual('https://localhost/abc/img0.png')
      expect(getByAltText('img2').src).toEqual('https://localhost/abc/img1.png')
    })
  })

  it('returns the article with image', () => {
    const article = {
      id: 1,
      locale: 'en-us',
      body: '<img alt="img" src="https://cdn.com/id/img.png" />',
    }
    const { getByAltText } = renderComponent({ activeArticle: article })

    expect(getByAltText('img').src).toEqual('https://cdn.com/id/img.png')
  })

  it('injects the host name when there are images in the article with relative `/attachments/` paths', () => {
    const article = {
      id: 1,
      locale: 'en-us',
      body: '<img alt="img" src="/attachments/token/abc/?name=img.png" />',
    }
    const { getByAltText } = renderComponent({ activeArticle: article })

    expect(getByAltText('img').src).toContain('//localhost/attachments/token/abc/?name=img.png')
  })
})
