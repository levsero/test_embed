import { queries } from 'pptr-testing-library'
import widget from './widget'

// queryAllByText will return an element for each of the provided strings
// e.g. ["one", "two"] => [HTMLElementSpan, HTMLElementSpan]
export const queryAllByText = async values =>
  Promise.all(values.map(async value => queries.queryByText(await widget.getDocument(), value)))
