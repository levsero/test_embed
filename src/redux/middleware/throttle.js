export default function throttle(block, allowedActionsFn = () => {}) {
  return () => (next) => (action) => {
    if (!block || allowedActionsFn(action.type)) {
      return next(action);
    }
  };
}
