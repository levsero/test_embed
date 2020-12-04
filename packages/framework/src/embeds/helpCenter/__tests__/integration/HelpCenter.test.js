import { fireEvent } from '@testing-library/react'
import React from 'react'

import createStore from 'src/redux/createStore'
import { http } from 'service/transport'
import { render } from 'src/util/testHelpers'
import * as utility from 'utility/devices'
import { updateEmbedAccessible, updateActiveEmbed } from 'src/redux/modules/base'
import { setContextualSuggestionsManually, contextualSearch } from 'embeds/helpCenter/actions'
import { TEST_IDS } from 'src/constants/shared'
import { updateSettings } from 'src/redux/modules/settings/settings-actions'
import HelpCenter from '../../index'
import { wait } from '@testing-library/react'

const renderComponent = () => {
  const store = createStore()

  store.dispatch(updateEmbedAccessible('helpCenterForm', true))
  store.dispatch(updateActiveEmbed('helpCenterForm'))

  return render(<HelpCenter />)
}

const results = {
  body: {
    results: [
      {
        id: 115002343711,
        url:
          'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343711-Welcome-to-your-Help-Center-.json',
        html_url:
          'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343711-Welcome-to-your-Help-Center-',
        author_id: 115806148031,
        comments_disabled: false,
        label_names: [],
        draft: false,
        promoted: false,
        position: 0,
        vote_sum: 0,
        vote_count: 0,
        section_id: 115000610611,
        created_at: '2017-10-23T23:27:18Z',
        updated_at: '2017-10-23T23:27:18Z',
        edited_at: '2017-10-23T23:27:18Z',
        name: 'Welcome to your Help Center!',
        title: 'Welcome to your Help Center!',
        body: '<p>this is the first article</p>',
        source_locale: 'en-us',
        locale: 'en-us',
        outdated: false,
        outdated_locales: [],
        permission_group_id: 617232,
        user_segment_id: null,
        result_type: 'article'
      },
      {
        id: 115002343791,
        url:
          'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343791-How-can-agents-leverage-knowledge-to-help-customers-.json',
        html_url:
          'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343791-How-can-agents-leverage-knowledge-to-help-customers-',
        author_id: 115806148031,
        comments_disabled: false,
        label_names: [],
        draft: false,
        promoted: false,
        position: 0,
        vote_sum: 0,
        vote_count: 0,
        section_id: 115000610631,
        created_at: '2017-10-23T23:27:19Z',
        updated_at: '2017-10-23T23:27:19Z',
        edited_at: '2017-10-23T23:27:19Z',
        name: 'How can agents leverage knowledge to help customers?',
        title: 'How can agents leverage knowledge to help customers?',
        body: '<p>this is the second article</p>',
        source_locale: 'en-us',
        locale: 'en-us',
        outdated: false,
        outdated_locales: [],
        permission_group_id: 617232,
        user_segment_id: null,
        result_type: 'article'
      },
      {
        id: 115002343751,
        url:
          'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343751-How-do-I-customize-my-Help-Center-.json',
        html_url:
          'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343751-How-do-I-customize-my-Help-Center-',
        author_id: 115806148031,
        comments_disabled: false,
        label_names: [],
        draft: false,
        promoted: false,
        position: 0,
        vote_sum: 0,
        vote_count: 0,
        section_id: 115000610631,
        created_at: '2017-10-23T23:27:19Z',
        updated_at: '2017-10-23T23:27:19Z',
        edited_at: '2017-10-23T23:27:19Z',
        name: 'How do I customize my Help Center?',
        title: 'How do I customize my Help Center?',
        body: '<p>this is the third article</p>',
        source_locale: 'en-us',
        locale: 'en-us',
        outdated: false,
        outdated_locales: [],
        permission_group_id: 617232,
        user_segment_id: null,
        result_type: 'article'
      },
      {
        id: 115002343731,
        url:
          'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343731-What-are-these-sections-and-articles-doing-here-.json',
        html_url:
          'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343731-What-are-these-sections-and-articles-doing-here-',
        author_id: 115806148031,
        comments_disabled: false,
        label_names: [],
        draft: false,
        promoted: false,
        position: 0,
        vote_sum: 0,
        vote_count: 0,
        section_id: 115000610631,
        created_at: '2017-10-23T23:27:18Z',
        updated_at: '2017-10-23T23:27:18Z',
        edited_at: '2017-10-23T23:27:18Z',
        name: 'What are these sections and articles doing here?',
        title: 'What are these sections and articles doing here?',
        body: '<p>this is the third article</p>',
        source_locale: 'en-us',
        locale: 'en-us',
        outdated: false,
        outdated_locales: [],
        permission_group_id: 617232,
        user_segment_id: null,
        result_type: 'article'
      },
      {
        id: 115002343771,
        url:
          'https://z3nwsee.zendesk.com/api/v2/help_center/en-us/articles/115002343771-How-do-I-publish-my-content-in-other-languages-.json',
        html_url:
          'https://z3nwsee.zendesk.com/hc/en-us/articles/115002343771-How-do-I-publish-my-content-in-other-languages-',
        author_id: 115806148031,
        comments_disabled: false,
        label_names: [],
        draft: false,
        promoted: false,
        position: 0,
        vote_sum: 0,
        vote_count: 0,
        section_id: 115000610631,
        created_at: '2017-10-23T23:27:19Z',
        updated_at: '2018-09-03T07:12:33Z',
        edited_at: '2018-09-03T07:12:33Z',
        name: 'How do I publish my content in other languages?',
        title: 'How do I publish my content in other languages?',
        body: '<p>this  is the fourth article</p>',
        source_locale: 'en-us',
        locale: 'en-us',
        outdated: false,
        outdated_locales: [],
        permission_group_id: 617232,
        user_segment_id: null,
        result_type: 'article'
      }
    ],
    page: 1,
    previous_page: null,
    next_page: null,
    per_page: 9,
    page_count: 1,
    count: 5
  }
}

const setupMocks = () => {
  http.get = jest.fn(({ path }) => {
    return new Promise((resolve, reject) => {
      switch (path) {
        case '/api/v2/help_center/articles/embeddable_search.json':
          resolve(results)
          break
        default:
          reject(new Error(`Unrecognized http request received! Path is ${path}`))
      }
    })
  })
}

const checkArticlesDisplayed = queryByText => {
  expect(queryByText('How can agents leverage knowledge to help customers?')).toBeInTheDocument()
  expect(queryByText('How do I customize my Help Center?')).toBeInTheDocument()
  expect(queryByText('What are these sections and articles doing here?')).toBeInTheDocument()
  expect(queryByText('How do I publish my content in other languages?')).toBeInTheDocument()
}

const focusedOnArticle = (queryByText, title) => {
  expect(document.activeElement).toEqual(queryByText(title))
}

const setupNoResultsMock = () => {
  http.get = jest.fn(() => {
    return new Promise(resolve => {
      resolve({
        body: {
          results: [],
          page: 1,
          previous_page: null,
          next_page: null,
          per_page: 9,
          page_count: 0,
          count: 0
        }
      })
    })
  })
}

it('shows no result page when there are no results', async () => {
  setupNoResultsMock()
  const { container, getByPlaceholderText, getByText } = renderComponent()
  const form = container.querySelector('form')
  const input = getByPlaceholderText('How can we help?')

  fireEvent.change(input, { target: { value: 'Help me' } })
  fireEvent.submit(form)

  await wait(async () => {
    expect(getByText('There are no results for "Help me"')).toBeInTheDocument()
  })
  expect(getByText('Try searching for something else.')).toBeInTheDocument()
})

test('renders the expected messages for contextual search', async () => {
  setupNoResultsMock()
  const { getByText, store, container, getByPlaceholderText } = renderComponent()

  store.dispatch(setContextualSuggestionsManually({ search: 'blah' }, noop))
  store.dispatch(contextualSearch(noop))

  await wait(async () => {
    expect(getByText('Enter a term in the search bar above to find articles.')).toBeInTheDocument()
  })

  const form = container.querySelector('form')
  const input = getByPlaceholderText('How can we help?')

  fireEvent.change(input, { target: { value: 'Help me' } })
  fireEvent.submit(form)

  await wait(async () => {
    expect(getByText('There are no results for "Help me"')).toBeInTheDocument()
  })
  expect(getByText('Try searching for something else.')).toBeInTheDocument()
})

describe('article page', () => {
  it('hides the original article button when originalArticleButton setting is false', async () => {
    setupMocks()

    const { queryByTestId, container, getByPlaceholderText, queryByText, store } = renderComponent()

    store.dispatch(updateSettings({ helpCenter: { originalArticleButton: false } }))

    const form = container.querySelector('form')
    const input = getByPlaceholderText('How can we help?')

    fireEvent.change(input, { target: { value: 'Help me' } })
    fireEvent.submit(form)

    await wait(async () => {
      fireEvent.click(queryByText('What are these sections and articles doing here?'))
    })
    expect(queryByTestId('Icon--link-external')).not.toBeInTheDocument()
  })
})

describe('desktop', () => {
  test('integration', async () => {
    setupMocks()
    const { queryByTestId, container, getByPlaceholderText, queryByText } = renderComponent()

    const form = container.querySelector('form')
    const input = getByPlaceholderText('How can we help?')

    fireEvent.change(input, { target: { value: 'Help me' } })
    fireEvent.submit(form)

    // displays the articles
    await wait(async () => {
      checkArticlesDisplayed(queryByText)
    })
    // focused on first article
    focusedOnArticle(queryByText, 'Welcome to your Help Center!')

    fireEvent.click(queryByText('What are these sections and articles doing here?'))

    expect(queryByText('this is the third article')).toBeInTheDocument()

    // Go back to search page
    fireEvent.click(queryByTestId(TEST_IDS.ICON_BACK))

    // focus is set on the previously clicked article
    expect(document.activeElement).toEqual(
      queryByText('What are these sections and articles doing here?')
    )

    // Search field is still filled in
    expect(getByPlaceholderText('How can we help?').value).toEqual('Help me')
  })
})

describe('mobile', () => {
  beforeEach(() => {
    jest.spyOn(utility, 'isMobileBrowser').mockReturnValue(true)
  })

  test('clearing search', () => {
    const { getByPlaceholderText, getByTestId } = renderComponent()
    const input = getByPlaceholderText('How can we help?')
    fireEvent.change(input, { target: { value: 'Help me' } })
    expect(input.value).toEqual('Help me')
    fireEvent.click(getByTestId(TEST_IDS.ICON_CLEAR_INPUT))
    expect(input.value).toEqual('')
  })

  test('integration', async () => {
    setupMocks()
    const { queryByTestId, container, queryByText, getByPlaceholderText } = renderComponent()

    const form = container.querySelector('form')
    const input = getByPlaceholderText('How can we help?')

    fireEvent.change(input, { target: { value: 'Help me' } })
    fireEvent.submit(form)

    await wait(async () => {
      checkArticlesDisplayed(queryByText)
    })
    // focused on first article
    focusedOnArticle(queryByText, 'Welcome to your Help Center!')

    fireEvent.click(queryByText('How can agents leverage knowledge to help customers?'))

    expect(queryByText('this is the second article')).toBeInTheDocument()

    // Go back to search page
    fireEvent.click(queryByTestId(TEST_IDS.ICON_BACK))

    // focus is set on the previously clicked article
    expect(document.activeElement).toEqual(
      queryByText('How can agents leverage knowledge to help customers?')
    )

    // Search field is still filled in
    expect(getByPlaceholderText('How can we help?').value).toEqual('Help me')
  })
})
