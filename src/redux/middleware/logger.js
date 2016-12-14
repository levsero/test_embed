/* eslint-disable no-console */
export default function logger() {
  return (next) => (action) => {
    if (__DEV__) {
      console.log(action);
    }
    next(action);
  };
}
