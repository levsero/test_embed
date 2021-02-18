import styled, { css } from 'styled-components'
import render from 'src/utils/test/render'
import dirStyles from '../dirStyles'

describe('dirStyles', () => {
  const ExampleComponent = styled.div`
    ${(props) => props.styles}
  `

  const defaultProps = { styles: '' }

  const renderComponent = (props = {}, options = {}) =>
    render(
      <ExampleComponent {...defaultProps} {...props}>
        test
      </ExampleComponent>,
      options
    )

  describe('left', () => {
    it('returns left when the locale direction is ltr', () => {
      const { getByText } = renderComponent({ styles: css`margin-${dirStyles.left}: 10px;` })

      expect(getByText('test')).toHaveStyleRule('margin-left', '10px')
    })

    it('returns right when the locale direction is rtl', () => {
      const { getByText } = renderComponent(
        { styles: css`margin-${dirStyles.left}: 10px;` },
        { themeProps: { rtl: true } }
      )

      expect(getByText('test')).toHaveStyleRule('margin-right', '10px')
    })
  })

  describe('right', () => {
    it('returns right when the locale direction is ltr', () => {
      const { getByText } = renderComponent({ styles: css`margin-${dirStyles.right}: 20px;` })

      expect(getByText('test')).toHaveStyleRule('margin-right', '20px')
    })

    it('returns left when the locale direction is rtl', () => {
      const { getByText } = renderComponent(
        { styles: css`margin-${dirStyles.right}: 20px;` },
        { themeProps: { rtl: true } }
      )

      expect(getByText('test')).toHaveStyleRule('margin-left', '20px')
    })
  })

  describe('swap', () => {
    it('returns the first argument when the locale direction is ltr', () => {
      const { getByText } = renderComponent({
        styles: css`
          color: ${dirStyles.swap('blue', 'orange')};
        `,
      })

      expect(getByText('test')).toHaveStyleRule('color', 'blue')
    })

    it('returns the second argument when the locale direction is ltr', () => {
      const { getByText } = renderComponent(
        {
          styles: css`
            color: ${dirStyles.swap('blue', 'orange')};
          `,
        },
        { themeProps: { rtl: true } }
      )

      expect(getByText('test')).toHaveStyleRule('color', 'orange')
    })
  })

  describe('borderRadius', () => {
    it('returns css to style the border radius following the default border radius syntax order when locale is ltr', () => {
      const { getByText } = renderComponent({
        styles: css`
          ${dirStyles.borderRadius('1px', '2px', '3px', '4px')}
        `,
      })

      expect(getByText('test')).toHaveStyleRule('border-top-left-radius', '1px')
      expect(getByText('test')).toHaveStyleRule('border-top-right-radius', '2px')
      expect(getByText('test')).toHaveStyleRule('border-bottom-right-radius', '3px')
      expect(getByText('test')).toHaveStyleRule('border-bottom-left-radius', '4px')
    })

    it('returns css to style border radius but with left and right values flipped when locale is rtl', () => {
      const { getByText } = renderComponent(
        {
          styles: css`
            ${dirStyles.borderRadius('1px', '2px', '3px', '4px')};
          `,
        },
        { themeProps: { rtl: true } }
      )

      expect(getByText('test')).toHaveStyleRule('border-top-left-radius', '2px')
      expect(getByText('test')).toHaveStyleRule('border-top-right-radius', '1px')
      expect(getByText('test')).toHaveStyleRule('border-bottom-right-radius', '4px')
      expect(getByText('test')).toHaveStyleRule('border-bottom-left-radius', '3px')
    })
  })

  describe('ltr', () => {
    it('renders the styles when the locale direction is ltr', () => {
      const { getByText } = renderComponent({
        styles: css`
          ${dirStyles.ltrOnly('color: blue;')}
        `,
      })

      expect(getByText('test')).toHaveStyleRule('color', 'blue')
    })

    it('does not render the styles when the locale direction is rtl', () => {
      const { getByText } = renderComponent(
        {
          styles: css`
            ${dirStyles.ltrOnly('color: blue;')}
          `,
        },
        { themeProps: { rtl: true } }
      )

      expect(getByText('test')).not.toHaveStyleRule('color', 'blue')
    })
  })

  describe('rtlOnly', () => {
    it('does not render the styles when the locale direction is ltr', () => {
      const { getByText } = renderComponent({
        styles: css`
          ${dirStyles.rtlOnly('color: orange;')}
        `,
      })

      expect(getByText('test')).not.toHaveStyleRule('color', 'orange')
    })

    it('renders the styles when the locale direction is rtl', () => {
      const { getByText } = renderComponent(
        {
          styles: css`
            ${dirStyles.rtlOnly('color: orange;')}
          `,
        },
        { themeProps: { rtl: true } }
      )

      expect(getByText('test')).toHaveStyleRule('color', 'orange')
    })
  })
})
