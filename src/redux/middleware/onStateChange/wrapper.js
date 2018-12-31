// Taken from https://github.com/franjohn21/redux-on-state-change
export default fn => store => next => action => {
  const prevState = store.getState();
  const result = next(action);
  const nextState = store.getState();

  fn(prevState, nextState, action, store.dispatch);

  return result;
};
