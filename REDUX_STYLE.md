# Redux Style Guide

This document contains guidelines for the Embeddable Framework's redux coding conventions.

**Table of Contents**

- [Redux Style Guide](#redux-style-guide)
  * [Key Definitions](#key-definitions)
  * [Structure](#structure)
      - [Modular state trees](#modular-state-trees)
  * [Reducers](#reducers)
      - [Break state into multiple reducers](#break-state-into-multiple-reducers)
      - [Reducers should be simple](#reducers-should-be-simple)
      - [Reducers file name convention](#reducers-file-name-convention)
  * [Actions](#actions)
      - [Define actions in all uppercase](#define-actions-in-all-uppercase)
      - [Define actions in one place](#define-actions-in-one-place)
      - [Name actions based on the action performed and not the result of the action](#name-actions-based-on-the-action-performed-and-not-the-result-of-the-action)
      - [Async requests should be named consistently](#async-requests-should-be-named-consistently)
  * [Action Creators](#action-creators)
      - [Always use an action creator to dispatch actions](#always-use-an-action-creator-to-dispatch-actions)
      - [Name actions creators based on the action performed and not the result of the action](#name-actions-creators-based-on-the-action-performed-and-not-the-result-of-the-action)
  * [Selectors](#selectors)
      - [Always use selectors to access state](#always-use-selectors-to-access-state)
      - [Use selectors for any logic concerning multiple states](#use-selectors-for-any-logic-concerning-multiple-states)
      - [Use reselect for memoization of state](#use-reselect-for-memoization-of-state)
      - [Composing selectors](#composing-selectors)
      - [Use selectors everywhere](#use-selectors-everywhere)
  * [Middleware](#middleware)
      - [Thunk middleware](#thunk-middleware)
      - [onStateChange middleware](#onstatechange-middleware)
      - [Other Middleware uses](#other-middleware-uses)

## Key Definitions

* **Store**: The store is an object that holds application state
* **Reducer**: Reducers specify how the application's state changes in response to actions sent to the store.
* **Actions**: Actions are payloads of information that are consumed by reducers via subscription to the action type.
* **Action creator**: Action creators are functions that create actions.
* **Selector**: Selectors are functions that take Redux state as an argument and return some data.
* **Middleware**: Middleware provides an extension point between dispatching an action, and the moment it reaches the reducer.

## Structure

#### Modular state trees
We use different modules for each Embed or feature and a base module for anything that is common between them.

## Reducers

#### Break state into multiple reducers
Each piece of state in the module should have it's own reducer so that we don't end up with a giant reducer that is difficult to manage. Some parts of state can be combined into a single reducer if they are tightly coupled.

#### Reducers should be simple
Do not put much logic inside of reducers. Any complex logic should be handled inside actions or inside middleware.

A reducer should never need to know about the state of other reducers.

```js
const actionCreator = {
  return {
    type: REQUEST_SENT,
    payload: otherReducerState ? true : false // logic handled inside actionCreator
  }
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REQUEST_SENT:
      return payload; // reducer simply saves what it's given
    default:
      return state;
  }
};
```

#### Reducers file name convention
Reducers should be named as `module-stateName` such as `helpCenter-articles`.

## Actions

#### Define actions in all uppercase
Actions exports should always be in all uppercase.
Actions defined in the action-types file should contain the module path.

```js
  export const SEARCH_REQUEST_SENT = 'widget/helpCenter/SEARCH_REQUEST_SENT'; // good

  export const searchRequestSent = 'widget/helpCenter/searchRequestSent'; // bad
  export const SEARCH_REQUEST_SENT = 'SEARCH_REQUEST_SENT'; // bad
```

#### Define actions in one place
Action names are stored in an `${module}-action-types.js` file in the root of their module that is imported into relevant files. They should never be hardcoded as strings inside actions or reducers.

#### Name actions based on the action performed and not the result of the action
Actions should be named according to the action that just happened, not the result of the action. For example: `BUTTON_CLICKED` instead of `UPDATE_SOME_STATE`. This means reducers are responding to intention of the action instead of having to follow the action name.

```js
export const VIEW_MORE_BUTTON_CLICKED = 'widget/helpCenter/VIEW_MORE_BUTTON_CLICKED'; // good
export const UPDATE_VIEW_MORE = 'widget/helpCenter/UPDATE_VIEW_MORE'; // bad
```

Note: There are some slight exceptions to this rule that were allowed on a case by case basis.

#### Async requests should be named consistently
When sending an asyncronous request to a 3rd party we use the thunk middleware and generate three actions. One for the request and then for any possible responses, usually success or fail. For example they should be named `*_REQUEST_SENT`, `*_REQUEST_SUCCESS`, `*_REQUEST_FAILURE`.

```js
export function sendChatRating(rating = null) {
  return (dispatch) => {
    zChat.sendChatRating(comment, (err) => {
      if (!err) {
        dispatch({ type: CHAT_RATING_REQUEST_SUCCESS });
      } else {
        dispatch({ type: CHAT_RATING_REQUEST_FAILURE });
      }
    });
    dispatch({ type: CHAT_RATING_REQUEST_SENT });
  };
}
```

We can then update any loading state when the sent action comes though.

```js
const initialState = false;

const loading = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CHAT_RATING_REQUEST_SENT:
      return true;
    case CHAT_RATING_REQUEST_SUCCESS:
    case CHAT_RATING_REQUEST_FAILURE:
      return false;
    default:
      return state;
  }
};
```

## Action Creators

#### Always use an action creator to dispatch actions
Never dispatch actions from anywhere but an action creator, even if they're small actions. This ensures we have a centralized place for our actions.

```js
export const sendMsgRequest = () => {
  return {
    type: CHAT_MSG_REQUEST_SENT
  };
};
```

#### Name actions creators based on the action performed and not the result of the action
Like actions, action creators should be named according to the action that is happening, not what the outcome of the action will be.

## Selectors

#### Always use selectors to access state
Never directly access certain parts of the application state with dot notation. Instead use selectors to access state, even if it’s extremely simple. This allows us to modify the state without having to change the props on the component.

```js
export const getZopimChatStatus = (state) => state.zopimChat.status;
```

#### Use selectors for any logic concerning multiple states
The component shouldn’t handle any logic that involves multiple bits of state, this should be done inside a selector and passed into the component as a single prop.

```js
// good
const getHasContextuallySearched = (state) => state.helpCenter.hasContextuallySearched;
const getTotalUserSearches = (state) => state.helpCenter.totalUserSearches
export const getHasSearched = (state) => getHasContextuallySearched(state) || getTotalUserSearches(state) > 0;

class HelpCenter extends Component {
  renderSearchBar = () => {
    // Only needs one prop and logic is handled inside selector
    if (this.props.hasSearched) return null;
    ...
  }
}

// bad
export const getHasContextuallySearched = (state) => state.helpCenter.hasContextuallySearched;
export const getTotalUserSearches = (state) => state.helpCenter.totalUserSearches

class HelpCenter extends Component {
  renderSearchBar = () => {
    // Needs two props and component has extra logic
    if (this.props.hasContextuallySearched || this.props.totalUserSearches > 0) return null;
    ...
  }
}
```

#### Use reselect for memoization of state
For complex state that rerenders often we should memoize it using reselect. The react dom rerenders everytime a new input is entered, therefore any complex transformations of data should be memoized to minimize the impact of this.

```js
export const getFilteredChats = createSelector(
  [getChats],  // If the value of getChats
  (chats) => {
    const filterChatType = (event) => _.includes(['chat.msg', 'chat.file'], event.type);

    return _.filter([...chats.values()], filterChatType);
  }
);
```

#### Composing selectors
When we need state from multiple modules we should import and combine the selectors from each module into a common selector in the root folder. This ensures we have a common place for all this kind of state.
```js
import { getZopimChatOnline } from './zopimChat/zopimChat-selectors';
import { getSettingsChatSuppress } from './settings/settings-selectors';

export const getChatEnabled = (state) => getZopimChatOnline(state) && !getSettingsChatSuppress(state);
```

#### Use selectors everywhere
Selectors should be imported wherever needed, not just inside components. They can also be used in actions, middleware and more.

## Middleware

#### Thunk middleware
Thunk middleware allows you to write action creators that return a function instead of an action. Inside this function you can delay dispatching actions and dispatch multiple actions in the one action creator. This is used for asynchronous requests as we can dispatch actions when a request is started as well as when it's completed.

```js
export function sendChatRating(rating = null) {
  return (dispatch) => {
    zChat.sendChatRating(comment, (err) => {
      if (!err) {
        dispatch({ type: CHAT_RATING_REQUEST_SUCCESS });
      } else {
        dispatch({ type: CHAT_RATING_REQUEST_FAILURE });
      }
    });
    dispatch({ type: CHAT_RATING_REQUEST_SENT });
  };
}
```

#### onStateChange middleware
onStateChange middleware allows us to react to changes in state outside of the reducers. This is useful because we can get state changes from 3rd parties (chat and talk) and we don't want to have to handle any changes we need to make based on these state changes inside components.

```js
const onChatConnected = (prevState, nextState, dispatch) => {
  if (getConnection(prevState) === 'connecting' && getConnection(nextState) !== 'connecting') {
    dispatch(accountSettingsUpdate());
  }
};

export default function onStateChange(prevState, nextState, _, dispatch) {
  onChatConnected(prevState, nextState, dispatch);
}
```

#### Other Middleware uses
Middleware can also be used to handle tangentially related application logic that doesn't belong in components or reducers but relies on knowing about state or action updates.
For example we have a blip middleware that handles sending blips when actions are performed so they don't need to be handled inside components or reducers to keep them as simple as possible.
