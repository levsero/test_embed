import IconButton from 'classicSrc/components/IconButton'
import { render } from 'classicSrc/util/testHelpers'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import ExternalLinkIcon from '@zendeskgarden/svg-icons/src/14/link-external.svg'

describe('IconButton', () => {
  const renderComponent = (props = {}, options) =>
    render(
      <IconButton {...props} aria-label="button">
        <ExternalLinkIcon />
      </IconButton>,
      options
    )

  it('defaults to a white background', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('button')).toHaveStyle('background-color: #ffffff')
  })

  it('uses dark text in front of a light background', () => {
    const { getByLabelText } = renderComponent(undefined, {
      themeProps: {
        frameBackgroundColor: '#fff',
      },
    })

    expect(getByLabelText('button')).toHaveStyle(`color: ${DEFAULT_THEME.palette.grey[800]}`)
  })

  it('uses light text in front of a dark background', () => {
    const { getByLabelText } = renderComponent(undefined, {
      widgetThemeProps: {
        frameBackgroundColor: '#000',
      },
    })

    expect(getByLabelText('button')).toHaveStyle(`color: #ffffff`)
  })
})
