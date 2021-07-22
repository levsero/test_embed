import { http } from 'service/transport'
import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'src/embeds/answerBot/constants'
import * as rootSelectors from 'src/embeds/answerBot/selectors/root'
import * as selectors from 'src/redux/modules/selectors/selectors'
import { render } from 'src/util/testHelpers'
import { Component as AnswerBot } from '../index'

const renderComponent = (props = {}) => {
  const componentProps = {
    title: 'Answer Bot',
    lastConversationScroll: 0,
    currentScreen: CONVERSATION_SCREEN,
    actions: {
      updateBackButtonVisibility: noop,
      conversationScrollChanged: noop,
    },
    ...props,
  }

  return render(<AnswerBot {...componentProps} />)
}

describe('conversation screen', () => {
  it('renders expected components', () => {
    const { queryByLabelText, queryByTestId } = renderComponent()

    expect(queryByLabelText('Type your question here...')).toBeInTheDocument()
    expect(queryByTestId('Icon--zendesk')).toBeInTheDocument()
  })

  it('hides zendesk logo', () => {
    const { queryByTestId } = renderComponent({
      hideZendeskLogo: true,
    })

    expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
  })
})

describe('article screen', () => {
  beforeEach(() => {
    jest.spyOn(http, 'getDynamicHostname').mockReturnValue('a.b.c')
    jest.spyOn(rootSelectors, 'getCurrentArticle').mockReturnValue({
      title: 'this is the title',
      body: 'this is the body',
    })
  })

  test('renders the article', () => {
    const { queryByText } = renderComponent({
      currentScreen: ARTICLE_SCREEN,
    })

    expect(queryByText('this is the title')).toBeInTheDocument()
    expect(queryByText('this is the body')).toBeInTheDocument()
  })

  test('does not render the chat input box', () => {
    const { queryByLabelText } = renderComponent({
      currentScreen: ARTICLE_SCREEN,
    })

    expect(queryByLabelText('Type your question here...')).not.toBeInTheDocument()
  })

  test('renders the logo by default', () => {
    const { queryByTestId } = renderComponent({
      currentScreen: ARTICLE_SCREEN,
    })

    expect(queryByTestId('Icon--zendesk')).toBeInTheDocument()
  })

  test('hides the logo', () => {
    jest.spyOn(selectors, 'getHideZendeskLogo').mockReturnValue(true)
    const { queryByTestId } = renderComponent({
      currentScreen: ARTICLE_SCREEN,
    })

    expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
  })
})
