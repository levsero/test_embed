import React from 'react'
import { render } from 'utility/testHelpers'
import { find } from 'styled-components/test-utils'
import { isMobileBrowser } from 'utility/devices'
import { onNextTick } from 'utility/utils'
import { Component as ChatMenu } from './..'
import { SoundOffIcon, SoundOnIcon } from './../styles'
import { TEST_IDS } from 'constants/shared'

jest.mock('utility/devices')

describe('ChatMenu', () => {
  const defaultProps = {
    isOpen: false,
    onToggle: jest.fn(),
    soundEnabled: false,
    endChatDisabled: false,
    editContactDetailsEnabled: false,
    emailTranscriptEnabled: true,
    goBackIsVisible: true,
    soundIsVisible: true,
    handleSoundIconClick: jest.fn(),
    updateEmailTranscriptVisibility: jest.fn(),
    updateContactDetailsVisibility: jest.fn(),
    updateEndChatModalVisibility: jest.fn(),
    onBackClick: jest.fn(),
  }

  const findSvg = (container, svgName) => container.querySelector(`[realfilename="${svgName}"]`)

  const renderComponent = (props = {}) => render(<ChatMenu {...defaultProps} {...props} />)

  describe('when on mobile', () => {
    beforeEach(() => {
      isMobileBrowser.mockReturnValue(true)
    })

    it('uses a menu icon as trigger', () => {
      const { container } = renderComponent()

      expect(findSvg(container, 'menu-fill.svg')).toBeInTheDocument()
    })
  })

  describe('when on desktop', () => {
    beforeEach(() => {
      isMobileBrowser.mockReturnValue(false)
    })

    it('uses a ellipsis icon as trigger', () => {
      isMobileBrowser.mockReturnValue(false)

      const { container } = renderComponent()

      expect(findSvg(container, 'overflow-stroke.svg')).toBeInTheDocument()
    })
  })

  it('calls onToggle to open the dropdown', () => {
    const onToggle = jest.fn()

    const { queryByTestId } = renderComponent({ onToggle, isOpen: false })

    queryByTestId(TEST_IDS.CHAT_MENU).click()

    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('calls onToggle to close the dropdown', () => {
    const onToggle = jest.fn()

    const { queryByTestId } = renderComponent({ onToggle, isOpen: true })

    queryByTestId(TEST_IDS.CHAT_MENU).click()

    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('closes the email transcript modal when opened', () => {
    const updateEmailTranscriptVisibility = jest.fn()

    const { queryByTestId } = renderComponent({ updateEmailTranscriptVisibility, isOpen: false })

    queryByTestId(TEST_IDS.CHAT_MENU).click()

    expect(updateEmailTranscriptVisibility).toHaveBeenCalledWith(false)
  })

  it('closes the contact details modal when opened', () => {
    const updateContactDetailsVisibility = jest.fn()

    const { queryByTestId } = renderComponent({ updateContactDetailsVisibility, isOpen: false })

    queryByTestId(TEST_IDS.CHAT_MENU).click()

    expect(updateContactDetailsVisibility).toHaveBeenCalledWith(false)
  })

  it('closes the end chat modal when opened', () => {
    const updateEndChatModalVisibility = jest.fn()

    const { queryByTestId } = renderComponent({ updateEndChatModalVisibility, isOpen: false })

    queryByTestId(TEST_IDS.CHAT_MENU).click()

    expect(updateEndChatModalVisibility).toHaveBeenCalledWith(false)
  })

  it('renders as open when prop isOpen is true', (done) => {
    const { queryByText } = renderComponent({ isOpen: true })

    onNextTick(() => {
      expect(queryByText('Sound')).toBeVisible()
      done()
    })
  })

  it('does not render when prop isOpen is false', (done) => {
    const { queryByText } = renderComponent({ isOpen: false })

    onNextTick(() => {
      expect(queryByText('Sound')).toBeNull()
      done()
    })
  })

  describe('when sound is enabled', () => {
    it('renders a sound enabled icon when sound is turned on', () => {
      const { container } = renderComponent({ isOpen: true, soundEnabled: true })

      expect(find(container, SoundOnIcon)).toBeInTheDocument()
    })

    it('turns off sound when sound option is clicked and ', (done) => {
      const handleSoundIconClick = jest.fn()
      const { queryByText } = renderComponent({
        isOpen: true,
        soundEnabled: true,
        handleSoundIconClick,
      })

      queryByText('Sound').click()

      onNextTick(() => {
        expect(handleSoundIconClick).toHaveBeenCalledWith({ sound: false })
        done()
      })
    })
  })

  describe('when sound is disabled', () => {
    it('renders a sound off icon when sound is turned on', () => {
      const { container } = renderComponent({ isOpen: true, soundEnabled: false })

      expect(find(container, SoundOffIcon)).toBeInTheDocument()
    })

    it('turns on sound when sound option is clicked', (done) => {
      const handleSoundIconClick = jest.fn()
      const { queryByText } = renderComponent({
        isOpen: true,
        soundEnabled: false,
        handleSoundIconClick,
      })

      queryByText('Sound').click()

      onNextTick(() => {
        expect(handleSoundIconClick).toHaveBeenCalledWith({ sound: true })
        done()
      })
    })
  })

  it('does not close the dropdown when sound option is clicked', (done) => {
    const onToggle = jest.fn()
    const { queryByText } = renderComponent({
      isOpen: true,
      onToggle,
    })

    queryByText('Sound').click()

    onNextTick(() => {
      expect(onToggle).not.toHaveBeenCalled()
      done()
    })
  })

  it('opens the email transcript form when email option is clicked', (done) => {
    const updateEmailTranscriptVisibility = jest.fn()
    const { queryByText } = renderComponent({
      isOpen: true,
      updateEmailTranscriptVisibility,
    })

    queryByText('Email transcript').click()

    onNextTick(() => {
      expect(updateEmailTranscriptVisibility).toHaveBeenCalledWith(true)
      done()
    })
  })

  it('opens the contact details form when contact details option is clicked', (done) => {
    const updateContactDetailsVisibility = jest.fn()
    const { queryByText } = renderComponent({
      isOpen: true,
      editContactDetailsEnabled: true,
      updateContactDetailsVisibility,
    })

    queryByText('Edit contact details').click()

    onNextTick(() => {
      expect(updateContactDetailsVisibility).toHaveBeenCalledWith(true)
      done()
    })
  })

  it('does not render the edit contact details option when contact details are not enabled', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
    })

    expect(queryByText('Edit contact details')).toBeNull()
  })

  it('opens the end chat modal when end chat option is clicked', (done) => {
    const updateEndChatModalVisibility = jest.fn()
    const { queryByText } = renderComponent({
      isOpen: true,
      updateEndChatModalVisibility,
    })

    queryByText('End chat').click()

    onNextTick(() => {
      expect(updateEndChatModalVisibility).toHaveBeenCalledWith(true)
      done()
    })
  })

  it('disables the end chat option when user is not chatting', () => {
    const { queryByText } = renderComponent({ isOpen: true, endChatDisabled: true })

    expect(queryByText('End chat').getAttribute('disabled')).not.toBe(undefined)
  })

  it('does not render the email transcript option when it is not enabled', () => {
    const { queryByText } = renderComponent({ isOpen: true, emailTranscriptEnabled: false })

    expect(queryByText('Email transcript')).not.toBeInTheDocument()
  })

  it('renders the email transcript option when it is enabled', () => {
    const { queryByText } = renderComponent({ isOpen: true, emailTranscriptEnabled: true })

    expect(queryByText('Email transcript')).toBeInTheDocument()
  })

  it('calls onBackClick when the back item is selected', (done) => {
    const onBackClick = jest.fn()
    const { queryByText } = renderComponent({
      isOpen: true,
      onBackClick,
    })

    queryByText('Go Back').click()

    onNextTick(() => {
      expect(onBackClick).toHaveBeenCalled()
      done()
    })
  })

  it('displays the back item when goBackIsVisible is true', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      goBackIsVisible: true,
    })

    expect(queryByText('Go Back')).toBeInTheDocument()
  })

  it('does not display the back item when goBackIsVisible is true', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      goBackIsVisible: false,
    })

    expect(queryByText('Go Back')).not.toBeInTheDocument()
  })

  it('displays the sound item when soundIsVisible is true', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      soundIsVisible: true,
    })

    expect(queryByText('Sound')).toBeInTheDocument()
  })

  it('does not display the sound item when soundIsVisible is true', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      soundIsVisible: false,
    })

    expect(queryByText('Sound')).not.toBeInTheDocument()
  })
})
