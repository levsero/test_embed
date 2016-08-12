export function updateSearchTerm(searchTerm) {
  return {
    type: 'UPDATE_SEARCH_TERM',
    payload: { searchTerm }
  }
}

// example thunk action
export function updateSearchTermSlowly(searchTerm) {
  return (dispatch) => {
    request(thing).then((response) => {
      dispatch(happyAction(response))
    }).catch((err) => {
      dispatch(sadAction(err.message))
    })
  }
}
