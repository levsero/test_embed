import { timeFromMinutes } from '../../../../src/util/time';

describe('ChatOperatingHours component', () => {
  let ChatOperatingHours;
  const ChatOperatingHoursPath = buildSrcPath('component/chat/ChatOperatingHours');
  const handleOfflineFormBackFn = () => {};

  const mockOperatingHours = {
    account_schedule: [
      [{start: 456, end: 789}],
      [{start: 456, end: 789}],
      [],
      [{start: 456, end: 789}],
      [{start: 456, end: 789}],
      [{start: 456, end: 789}],
      []
    ],
    enabled: true,
    timezone: 'Australia/Melbourne'
  };

  const Button = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatOperatingHours.scss': {
        locals: {
          container: 'containerClass',
          title: 'titleClass',
          singleDay: 'singleDayClass',
          dayName: 'dayNameClass',
          button: 'buttonClass'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'component/button/Button': {
        Button: Button
      },
      'utility/time': {
        timeFromMinutes: timeFromMinutes
      }
    });

    mockery.registerAllowable(ChatOperatingHoursPath);
    ChatOperatingHours = requireUncached(ChatOperatingHoursPath).ChatOperatingHours;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours
          operatingHours={mockOperatingHours}
          handleOfflineFormBack={handleOfflineFormBackFn} />
      );

      result = component.render();
    });

    it('returns a <div> parent element', () => {
      expect(TestUtils.isElementOfType(result, 'div'))
        .toEqual(true);
    });

    it('has the right className prop', () => {
      expect(result.props.className).toEqual('containerClass');
    });

    describe("the component's title", () => {
      let title;

      beforeEach(() => {
        title = result.props.children[0];
      });

      it('is contained in the right element', () => {
        expect(title.type).toEqual('h4');
      });

      it('is assigned the right className', () => {
        expect(title.props.className).toEqual('titleClass');
      });

      it('has the right content', () => {
        expect(title.props.children)
          .toEqual('embeddable_framework.chat.operatingHours.label.title');
      });
    });

    describe('the list of days', () => {
      let list;

      beforeEach(() => {
        list = result.props.children[1];
      });

      it('is contained in the right element', () => {
        expect(list.type).toEqual('ul');
      });
    });
  });

  describe('renderBackButton', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours
          operatingHours={mockOperatingHours}
          handleOfflineFormBack={handleOfflineFormBackFn} />
      );

      result = component.renderBackButton();
    });

    it('returns a <div> parent element', () => {
      expect(TestUtils.isElementOfType(result, Button))
        .toEqual(true);
    });

    it('has the right className prop', () => {
      expect(result.props.className).toEqual('buttonClass');
    });

    it('has the right label prop', () => {
      expect(result.props.label).toEqual('Go Back');
    });

    it('has the right onClick prop', () => {
      expect(result.props.onClick).toEqual(jasmine.any(Function));
    });

    it('has the right type prop', () => {
      expect(result.props.type).toEqual('button');
    });
  });

  describe('renderDays', () => {
    let component,
      result,
      day;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours
          operatingHours={mockOperatingHours}
          handleOfflineFormBack={handleOfflineFormBackFn} />
      );

      result = component.renderDays();
    });

    it('returns a collection with every day of the week', () => {
      expect(result.length).toEqual(7);
    });

    _.times(7, (dayIndex) => {
      beforeEach(() => {
        day = result[dayIndex];
      });

      it(`contains information about day ${dayIndex} in the right element`, () => {
        expect(day.type).toEqual('li');
      });

      it(`has the right className prop for day ${dayIndex}`, () => {
        expect(day.props.className).toEqual('singleDayClass');
      });

      it(`has the right title element for day ${dayIndex}`, () => {
        const title = day.props.children[0];

        expect(title.type).toEqual('h5');
      });

      it(`has the right title className for day ${dayIndex}`, () => {
        const title = day.props.children[0];

        expect(title.props.className).toEqual('dayNameClass');
      });

      it(`has the right content element for day ${dayIndex}`, () => {
        const paragraph = day.props.children[1];

        expect(paragraph.type).toEqual('p');
      });
    });

    describe('for days with opening hours', () => {
      let openDay;

      beforeEach(() => {
        openDay = result[0];
      });

      it('contains a string with the range of hours', () => {
        const paragraph = openDay.props.children[1];

        expect(paragraph.props.children)
          .toEqual('embeddable_framework.chat.operatingHours.label.hourRange');
      });
    });

    describe('for days without opening hours', () => {
      let openDay;

      beforeEach(() => {
        openDay = result[2];
      });

      it('comes up as closed', () => {
        const paragraph = openDay.props.children[1];

        expect(paragraph.props.children)
          .toEqual('Closed');
      });
    });
  });
});
