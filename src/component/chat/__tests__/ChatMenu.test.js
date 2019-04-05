import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { ChatMenu } from '../ChatMenu';

const renderMenu = ({
  menuVisible = true,
  disableEndChat = false,
  attachmentsEnabled = true,
  emailTranscriptEnabled = true,
  isMobile = false,
  editContactDetailsEnabled = true,
  playSound = true
}, options) => {
  const onSoundClickMock = jest.fn();
  const emailTranscriptOnClickMock = jest.fn();
  const contactDetailsOnClickMock = jest.fn();
  const onSendFileClickMock = jest.fn();
  const onGoBackClickMock = jest.fn();
  const endChatOnClickMock = jest.fn();

  const utils = render(
    <ChatMenu
      playSound={playSound}
      show={menuVisible}
      disableEndChat={disableEndChat}
      attachmentsEnabled={attachmentsEnabled}
      onGoBackClick={onGoBackClickMock}
      onSendFileClick={onSendFileClickMock}
      endChatOnClick={endChatOnClickMock}
      contactDetailsOnClick={contactDetailsOnClickMock}
      emailTranscriptOnClick={emailTranscriptOnClickMock}
      onSoundClick={onSoundClickMock}
      emailTranscriptEnabled={emailTranscriptEnabled}
      isMobile={isMobile}
      loginEnabled={editContactDetailsEnabled} />, options);

  return {
    ...utils,
    rerender: (componentProps, options) => renderMenu(componentProps, { container: utils.container, ...options }),
    onSoundClickMock,
    emailTranscriptOnClickMock,
    contactDetailsOnClickMock,
    onSendFileClickMock,
    onGoBackClickMock,
    endChatOnClickMock
  };
};

describe('mobile', () => {
  test('go back to help center menu item', () => {
    const { onGoBackClickMock, queryByText } = renderMenu({ isMobile: true });
    const goBackNode = queryByText('Go back to Help Center');

    expect(goBackNode).toBeInTheDocument();

    expect(onGoBackClickMock).not.toHaveBeenCalled();
    fireEvent.click(goBackNode);
    expect(onGoBackClickMock).toHaveBeenCalled();
  });

  describe('attachments', () => {
    test('when enabled', () => {
      const { queryByText } = renderMenu({ isMobile: true, attachmentsEnabled: true });

      expect(queryByText('Send file')).toBeInTheDocument();
    });

    test('when disabled', () => {
      const { queryByText } = renderMenu({ isMobile: true, attachmentsEnabled: false });

      expect(queryByText('Send file')).not.toBeInTheDocument();
    });
  });

  describe('end chat', () => {
    test('when enabled', () => {
      const { queryByText, endChatOnClickMock } = renderMenu({ isMobile: true, disableEndChat: false });
      const endChatNode = queryByText('End chat');

      expect(endChatNode).toBeInTheDocument();

      expect(endChatOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(endChatNode);
      expect(endChatOnClickMock).toHaveBeenCalled();
    });

    test('when disabled', () => {
      const { queryByText, endChatOnClickMock } = renderMenu({ isMobile: true, disableEndChat: true });
      const endChatNode = queryByText('End chat');

      expect(endChatNode).toBeInTheDocument();

      expect(endChatOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(endChatNode);
      expect(endChatOnClickMock).not.toHaveBeenCalled();
    });
  });

  describe('email transcript', () => {
    test('when enabled', () => {
      const { queryByText, emailTranscriptOnClickMock } = renderMenu({ isMobile: true, emailTranscriptEnabled: true });
      const emailTranscriptNode = queryByText('Email transcript');

      expect(emailTranscriptNode).toBeInTheDocument();

      expect(emailTranscriptOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(emailTranscriptNode);
      expect(emailTranscriptOnClickMock).toHaveBeenCalled();
    });

    test('when disabled', () => {
      const { queryByText, emailTranscriptOnClickMock } = renderMenu({
        isMobile: false,
        emailTranscriptEnabled: false
      });
      const emailTranscriptNode = queryByText('Email transcript');

      expect(emailTranscriptNode).toBeInTheDocument();

      expect(emailTranscriptOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(emailTranscriptNode);
      expect(emailTranscriptOnClickMock).not.toHaveBeenCalled();
    });
  });

  describe('edit contact details', () => {
    test('when enabled', () => {
      const { queryByText, contactDetailsOnClickMock } = renderMenu({
        isMobile: false,
        editContactDetailsEnabled: true
      });
      const editContactDetailsNode = queryByText('Edit contact details');

      expect(editContactDetailsNode).toBeInTheDocument();

      expect(contactDetailsOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(editContactDetailsNode);
      expect(contactDetailsOnClickMock).toHaveBeenCalled();
    });

    test('when disabled', () => {
      const { queryByText } = renderMenu({ isMobile: true, editContactDetailsEnabled: false });
      const editContactDetailsNode = queryByText('Edit contact details');

      expect(editContactDetailsNode).not.toBeInTheDocument();
    });
  });

  test('non existence of sound button', () => {
    const { queryByText } = renderMenu({ isMobile: true });

    expect(queryByText('Sound')).not.toBeInTheDocument();
  });

  test('menu not shown', () => {
    const { queryByText } = renderMenu({ isMobile: true, menuVisible: false });

    expect(queryByText('End chat')).not.toBeInTheDocument();
    expect(queryByText('Go back to Help Center')).not.toBeInTheDocument();
    expect(queryByText('Email transcript')).not.toBeInTheDocument();
    expect(queryByText('Edit contact details')).not.toBeInTheDocument();
  });
});

describe('desktop', () => {
  test('non existence of go back button', () => {
    const { queryByText } = renderMenu({ isMobile: false });
    const goBackNode = queryByText('Go back to Help Center');

    expect(goBackNode).not.toBeInTheDocument();
  });

  test('non existent attachments option', () => {
    const { queryByText } = renderMenu({ isMobile: false, attachmentsEnabled: true });

    expect(queryByText('Send file')).not.toBeInTheDocument();
  });

  describe('end chat', () => {
    test('when enabled', () => {
      const { queryByText, endChatOnClickMock } = renderMenu({ isMobile: false, disableEndChat: false });
      const endChatNode = queryByText('End chat');

      expect(endChatNode).toBeInTheDocument();

      expect(endChatOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(endChatNode);
      expect(endChatOnClickMock).toHaveBeenCalled();
    });

    test('when disabled', () => {
      const { queryByText, endChatOnClickMock } = renderMenu({ isMobile: false, disableEndChat: true });
      const endChatNode = queryByText('End chat');

      expect(endChatNode).toBeInTheDocument();

      expect(endChatOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(endChatNode);
      expect(endChatOnClickMock).not.toHaveBeenCalled();
    });
  });

  describe('email transcript', () => {
    test('when enabled', () => {
      const { queryByText, emailTranscriptOnClickMock } = renderMenu({ isMobile: false, emailTranscriptEnabled: true });
      const emailTranscriptNode = queryByText('Email transcript');

      expect(emailTranscriptNode).toBeInTheDocument();

      expect(emailTranscriptOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(emailTranscriptNode);
      expect(emailTranscriptOnClickMock).toHaveBeenCalled();
    });

    test('when disabled', () => {
      const { queryByText, emailTranscriptOnClickMock } = renderMenu({
        isMobile: false,
        emailTranscriptEnabled: false
      });
      const emailTranscriptNode = queryByText('Email transcript');

      expect(emailTranscriptNode).toBeInTheDocument();

      expect(emailTranscriptOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(emailTranscriptNode);
      expect(emailTranscriptOnClickMock).not.toHaveBeenCalled();
    });
  });

  describe('edit contact details', () => {
    test('when enabled', () => {
      const { queryByText, contactDetailsOnClickMock } = renderMenu({
        isMobile: false,
        editContactDetailsEnabled: true
      });
      const editContactDetailsNode = queryByText('Edit contact details');

      expect(editContactDetailsNode).toBeInTheDocument();

      expect(contactDetailsOnClickMock).not.toHaveBeenCalled();
      fireEvent.click(editContactDetailsNode);
      expect(contactDetailsOnClickMock).toHaveBeenCalled();
    });

    test('when disabled', () => {
      const { queryByText } = renderMenu({ isMobile: false, editContactDetailsEnabled: false });
      const editContactDetailsNode = queryByText('Edit contact details');

      expect(editContactDetailsNode).not.toBeInTheDocument();
    });
  });

  test('sound button', () => {
    const { queryByTestId, queryByText, rerender } = renderMenu({ isMobile: false, playSound: false });
    const soundNode = queryByText('Sound');
    const getSoundOnIconNode = () => queryByTestId('Icon--sound-on');
    const getSoundOffIconNode = () => queryByTestId('Icon--sound-off');

    expect(soundNode).toBeInTheDocument();

    expect(getSoundOnIconNode()).not.toBeInTheDocument();
    expect(getSoundOffIconNode()).toBeInTheDocument();

    rerender({ playSound: true });

    expect(getSoundOnIconNode()).toBeInTheDocument();
    expect(getSoundOffIconNode()).not.toBeInTheDocument();
  });

  test('menu not shown', () => {
    const { queryByText } = renderMenu({ isMobile: false, menuVisible: false });

    expect(queryByText('End chat')).not.toBeInTheDocument();
    expect(queryByText('Sound')).not.toBeInTheDocument();
    expect(queryByText('Email transcript')).not.toBeInTheDocument();
    expect(queryByText('Edit contact details')).not.toBeInTheDocument();
  });
});
