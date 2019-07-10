import { render, fireEvent } from 'react-testing-library'
import React from 'react'

import { HelpCenterDesktop } from '../HelpCenterDesktop'

const renderHelpCenterDesktop = props => {
  const defaultProps = {
    buttonLabel: '',
    chatAvailable: false,
    children: <div />,
    handleNextClick: noop,
    handleOnChangeValue: noop,
    search: noop,
    callbackEnabled: false,
    isContextualSearchPending: false,
    chatOfflineAvailable: false,
    searchPlaceholder: '',
    title: ''
  }

  const mergedProps = { ...defaultProps, ...props }

  return render(<HelpCenterDesktop {...mergedProps} />)
}

test('renders the expected components', () => {
  const { container } = renderHelpCenterDesktop()

  expect(container).toMatchSnapshot()
})

test('renders the expected components when isOnInitialDesktopSearchScreen is true', () => {
  const { container } = renderHelpCenterDesktop({
    isOnInitialDesktopSearchScreen: true
  })

  expect(container).toMatchSnapshot()
})

test('renders the expected components when articleViewActive is true', () => {
  const { container } = renderHelpCenterDesktop({ articleViewActive: true })

  expect(container).toMatchSnapshot()
})

test('hides the logo when hideZendeskLogo is true', () => {
  const { queryByTestId } = renderHelpCenterDesktop({ hideZendeskLogo: true })

  expect(queryByTestId('Icon--zendesk')).not.toBeInTheDocument()
})

describe('render', () => {
  describe('footer', () => {
    it('renders scrollContainer footer when not on initial screen', () => {
      const { container } = renderHelpCenterDesktop()

      expect(container.querySelector('footer').className).toContain('footerShadow')
    })

    it('renders scrollContainer without footer shadow when on initial screen', () => {
      const { container } = renderHelpCenterDesktop({
        isOnInitialDesktopSearchScreen: true
      })

      expect(container.querySelector('footer').className).not.toContain('footerShadow')
    })

    it('renders scrollContainer without footer shadow when zendesk logo is hidden', () => {
      const { container } = renderHelpCenterDesktop({
        hideZendeskLogo: true
      })

      expect(container.querySelector('footer').className).not.toContain('footerShadow')
    })

    it('renders scrollContainer without footer shadow when showNextButton is false', () => {
      const { container } = renderHelpCenterDesktop({
        showNextButton: false
      })

      expect(container.querySelector('footer').className).not.toContain('footerShadow')
    })

    it('renders button with loading animation', () => {
      const { container } = renderHelpCenterDesktop({
        showNextButton: true,
        buttonLoading: true
      })

      expect(container.querySelector('footer')).toMatchSnapshot()
    })

    it('renders expected next button', () => {
      const { container } = renderHelpCenterDesktop({
        showNextButton: true,
        buttonLabel: 'hello world'
      })

      expect(container.querySelector('footer')).toMatchSnapshot()
    })

    it('does not render footer content if showNextButton is false and hasSearched is false', () => {
      const { container } = renderHelpCenterDesktop({
        hasSearched: false,
        showNextButton: false
      })

      expect(container.querySelector('.buttonContainer')).not.toBeInTheDocument()
    })

    it('does not render footer content if showNextButton is false and hasSearched is true', () => {
      const { container } = renderHelpCenterDesktop({
        hasSearched: true,
        showNextButton: false
      })

      expect(container.querySelector('.buttonContainer')).not.toBeInTheDocument()
    })

    it('shows after something has been searched', () => {
      const { container } = renderHelpCenterDesktop({
        hasSearched: true,
        showNextButton: true
      })

      expect(container.querySelector('.buttonContainer')).toBeInTheDocument()
    })
  })

  describe('height', () => {
    it('sets the expected properties when on initial desktop screen', () => {
      const { getByTestId } = renderHelpCenterDesktop({
        isOnInitialDesktopSearchScreen: true,
        maxWidgetHeight: 150
      })
      const scrollContainer = getByTestId('scrollcontainer')

      expect(scrollContainer).toHaveStyle('height: 150px;')
      expect(scrollContainer).toHaveClass('noCustomHeight')
    })

    it('sets the expected properties when not on initial desktop screen', () => {
      const { getByTestId } = renderHelpCenterDesktop({
        isOnInitialDesktopSearchScreen: false
      })
      const scrollContainer = getByTestId('scrollcontainer')

      expect(scrollContainer).toHaveStyle('height: 550px;')
    })
  })

  describe('when props.showNextButton is false and props.hasSearched is true', () => {
    describe('when props.articleViewActive is true and zendesk logo is hidden', () => {
      const { container } = renderHelpCenterDesktop({
        showNextButton: false,
        hasSearched: true,
        articleViewActive: true,
        hideZendeskLogo: true
      })

      expect(container.querySelector('.footerArticleView')).toBeInTheDocument()
    })

    describe('when props.articleViewActive is false', () => {
      it('passes footer class to ScrollContainer', () => {
        const { container } = renderHelpCenterDesktop({
          showNextButton: false,
          hasSearched: true,
          articleViewActive: false,
          hideZendeskLogo: true
        })

        expect(container.querySelector('.footer')).toBeInTheDocument()
      })
    })

    describe('when zendesk logo is not hidden', () => {
      it('passes footerLogo class to ScrollContainer', () => {
        const { container } = renderHelpCenterDesktop({
          hasSearched: true,
          showNextButton: false,
          articleViewActive: true,
          hideZendeskLogo: false
        })

        expect(container.querySelector('.footerLogo')).toBeInTheDocument()
      })
    })
  })

  describe('when props.showNextButton is false and props.articleViewActive is true', () => {
    describe('when zendesk logo is hidden', () => {
      it('passes footerArticleView class to ScrollContainer', () => {
        const { container } = renderHelpCenterDesktop({
          showNextButton: false,
          articleViewActive: true,
          hideZendeskLogo: true
        })

        expect(container.querySelector('.footerArticleView')).toBeInTheDocument()
      })
    })

    describe('when zendesk logo is not hidden', () => {
      it('passes footerLogo class to ScrollContainer', () => {
        const { container } = renderHelpCenterDesktop({
          showNextButton: false,
          hasSearched: true,
          articleViewActive: true,
          hideZendeskLogo: false
        })

        expect(container.querySelector('.footerLogo')).toBeInTheDocument()
      })
    })
  })

  describe('contextual search', () => {
    it('returns the child contents when articleViewActive and isContextualSearchPending are true', () => {
      const { queryByText } = renderHelpCenterDesktop({
        articleViewActive: true,
        isContextualSearchPending: true,
        children: <div>hello world</div>
      })

      expect(queryByText('hello world')).toBeInTheDocument()
    })

    it('returns the child contents when articleViewActive is false and isContextualSearchPending is true', () => {
      const { queryByText } = renderHelpCenterDesktop({
        articleViewActive: true,
        isContextualSearchPending: false,
        children: <div>hello world</div>
      })

      expect(queryByText('hello world')).toBeInTheDocument()
    })

    it('returns the loading bar when articleViewActive and isContextualSearchPending are true', () => {
      const { container, queryByText } = renderHelpCenterDesktop({
        articleViewActive: false,
        isContextualSearchPending: true,
        children: <div>hello world</div>
      })

      expect(queryByText('hello world')).not.toBeInTheDocument()
      expect(container.querySelector('.loadingBars')).toBeInTheDocument()
    })
  })
})

describe('on button click', () => {
  describe('when channel choice is on', () => {
    it('calls onNextClick', () => {
      const onNextClick = jest.fn(),
        handleNextClick = jest.fn()
      const { getByText } = renderHelpCenterDesktop({
        showNextButton: true,
        hasSearched: true,
        onNextClick,
        handleNextClick,
        buttonLabel: 'click me',
        channelChoice: true
      })

      fireEvent.click(getByText('click me'))
      expect(onNextClick).toHaveBeenCalled()
      expect(handleNextClick).not.toHaveBeenCalled()
    })
  })

  describe('when channel choice is off', () => {
    it('calls handleNextClick', () => {
      const onNextClick = jest.fn(),
        handleNextClick = jest.fn()
      const { getByText } = renderHelpCenterDesktop({
        showNextButton: true,
        hasSearched: true,
        onNextClick,
        handleNextClick,
        buttonLabel: 'click me',
        channelChoice: false
      })

      fireEvent.click(getByText('click me'))
      expect(onNextClick).not.toHaveBeenCalled()
      expect(handleNextClick).toHaveBeenCalled()
    })
  })
})
