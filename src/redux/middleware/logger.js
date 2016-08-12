export default function logger(store) {
  return (next) => (action) => {
    if (__DEV__) {
      console.log(action);
    }
    next(action);
  };
}
