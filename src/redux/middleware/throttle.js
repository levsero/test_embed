export default function throttle(block) {
  return () => (next) => (action) => {
    if (!block) {
      return next(action);
    }
  };
}
