import { render } from 'react-testing-library';
import React from 'react';
import connectedLauncher from '../WidgetLauncher';
import _ from 'lodash';

const WidgetLauncher = connectedLauncher.WrappedComponent;
const noop = () => {};

const renderComponent = (props = {}) => {
  const defaultProps = {
    isMobile: false,
    activeEmbed: 'ticketSubmissionForm',
    chatAvailable: false,
    helpCenterAvailable: false,
    talkOnline: false,
    callbackEnabled: false,
    onClick: noop,
    notificationCount: 0,
    forceUpdateWorld: noop,
    launcherClicked: noop,
    chatOfflineAvailable: false,
    launcherLabel: 'launcherLabel',
    chatLabel: 'chatLabel',
    unreadMessages: 0,
    showLabelMobile: false
  };
  const actualProps = { ...defaultProps, ...props };

  return render(<WidgetLauncher {...actualProps} />);
};

describe('WidgetLauncher', () => {
  it('renders the component', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  describe('launcher label', () => {
    test.each([
      [true,   true,   1,  '1 new',                      'label'],
      [true,   false,  1,  '1 new',                      'label'],
      [false,  true,   1,  '1 new',                      'label'],
      [false,  false,  1,  '1 new',                      'label'],
      [true,   true,   0,  'launcherLabel',              'label'],
      [true,   false,  0,  'launcherLabel',  'label labelMobile'],
      [false,  true,   0,  'launcherLabel',              'label'],
      [false,  false,  0,  'launcherLabel',              'label'],
    ])('when isMobile == %p && showLabelMobile == %p && notificationCount == %p, it contains text %p and classes %p',
      (isMobile, showLabelMobile, notificationCount, labelText, classes) => {
        const { queryByTestId } = renderComponent({
          isMobile,
          showLabelMobile,
          notificationCount
        });
        const label = queryByTestId('launcherLabel');
        const labelClasses = _.map(label.classList, (klass) => klass).join(' ');

        expect(label.innerHTML).toEqual(labelText);
        expect(labelClasses).toEqual(classes);
      }
    );
  });
});
