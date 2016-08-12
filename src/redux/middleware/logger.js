export default function logger(_store) {
  return (next) => (action) => {
    if (__DEV__) {
      console.log(action);
    }
    next(action);
  };
}
