import { render, fireEvent } from 'react-testing-library';
import React from 'react';

import { Icon, IconButton } from '../Icon';

describe('Icon', () => {
  it('renders expected classes', function() {
    const { container } = render(<Icon type="Icon--zendesk" />);

    expect(container)
      .toMatchSnapshot();
  });

  it('renders expected mobile classes when mobile is true', function() {
    const { container } = render(<Icon type="Icon--zendesk" isMobile={true} />);

    expect(container)
      .toMatchSnapshot();
  });

  it('renders expected flipx classes when flipX is true', function() {
    const { container } = render(<Icon type="Icon--zendesk" flipX={true} />);

    expect(container)
      .toMatchSnapshot();
  });
});

describe('IconButton', () => {
  it('renders expected classes, alt text and Icon', () => {
    const { container } = render(<IconButton type='Icon--zendesk' altText='Clickable Icon' />);

    expect(container)
      .toMatchSnapshot();
  });

  const getButton = (container) => container.querySelector('button');

  const renderIconButton = (buttonDisabled, tooltipDisabled) => {
    return render(
      <IconButton
        type='Icon--zendesk'
        altText='Clickable Icon'
        disabled={buttonDisabled}
        disableTooltip={tooltipDisabled} />
    );
  };

  describe('mouseover event', () => {
    it('shows tooltip when button and tooltips are enabled', () => {
      const { container } = renderIconButton(false, false);
      const button = getButton(container);

      fireEvent.mouseOver(button);
      expect(container)
        .toMatchSnapshot();
    });

    it('does not show tooltip when button is disabled', () => {
      const { container } = renderIconButton(true, false);
      const button = getButton(container);

      fireEvent.mouseOver(button);
      expect(container)
        .toMatchSnapshot();
    });

    it('does not show tooltip when tooltip is disabled', () => {
      const { container } = renderIconButton(false, true);
      const button = getButton(container);

      fireEvent.mouseOver(button);
      expect(container)
        .toMatchSnapshot();
    });
  });

  describe('keydown event', () => {
    const simulateKeyDown = (keyEvent) => {
      const handler = jest.fn();
      const { container } = render(
        <IconButton
          onClick={handler}
          altText='Clickable Icon'
          type='Icon--zendesk'
        />
      );
      const button = getButton(container);

      fireEvent.keyDown(button, keyEvent);

      return handler;
    };

    it('fires the onclick handler on Enter', () => {
      expect(simulateKeyDown({ key: 'Enter', keyCode: 13 }))
        .toHaveBeenCalled();
    });

    it('does not fire the onclick handler on other key codes', () => {
      expect(simulateKeyDown({ key: 'Space', keyCode: 32 }))
        .not.toHaveBeenCalled();
    });
  });
});
