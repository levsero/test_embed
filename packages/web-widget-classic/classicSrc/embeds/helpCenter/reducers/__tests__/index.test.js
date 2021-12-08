import reducer from '../index'

test('includes all expected substates', () => {
  expect(reducer({}, { type: '' })).toMatchInlineSnapshot(`
    Object {
      "articleDisplayed": null,
      "articles": Object {},
      "clickedArticles": Object {
        "current": null,
        "previous": null,
      },
      "config": Object {
        "answerBotEnabled": false,
        "buttonLabelKey": "message",
        "contextualHelpEnabled": false,
        "formTitleKey": "help",
        "signInRequired": false,
      },
      "contextualSearch": Object {
        "hasSearched": false,
        "screen": "",
      },
      "lastSearchTimestamp": -1,
      "manualContextualSuggestions": Object {
        "labels": Array [],
        "query": "",
        "url": false,
      },
      "restrictedImages": Object {},
      "resultsCount": 0,
      "resultsLocale": "",
      "searchAttempted": false,
      "searchFailed": false,
      "searchFieldValue": "",
      "searchId": 0,
      "searchLoading": false,
      "searchTerm": Object {
        "current": "",
        "previous": "",
      },
      "searchedArticles": Array [],
      "totalUserSearches": 0,
    }
  `)
})
