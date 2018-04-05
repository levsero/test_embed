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
          button: 'buttonClass',
          hours: 'hoursClass'
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
      dayName,
      range;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours
          operatingHours={mockOperatingHours}
          handleOfflineFormBack={handleOfflineFormBackFn} />
      );

      result = component.renderDays();
    });

    it('returns a definition pair for every day of the week', () => {
      expect(result.props.children.length).toEqual(14);
    });

    _.times(7, (dayIndex) => {
      beforeEach(() => {
        dayName = result.props.children[dayIndex];
        range = result.props.children[dayIndex + 1];
      });

      it(`contains information about day ${dayIndex} in the right element`, () => {
        expect(dayName.type).toEqual('dt');
      });

      it(`has the right className prop for day ${dayIndex}`, () => {
        expect(dayName.props.className).toEqual('dayNameClass');
      });

      it(`has the right className for the hour range on day ${dayIndex}`, () => {
        expect(range.props.className).toEqual('hoursClass');
      });

      it(`contains information about the range on day ${dayIndex} in the right element`, () => {
        expect(range.type).toEqual('dd');
      });
    });

    describe('for days with opening hours', () => {
      let openDayRange;

      beforeEach(() => {
        openDayRange = result.props.children[1];
      });

      it('contains a string with the range of hours', () => {
        expect(openDayRange.props.children)
          .toEqual('embeddable_framework.chat.operatingHours.label.hourRange');
      });
    });

    describe('for days without opening hours', () => {
      let closedDay;

      beforeEach(() => {
        closedDay = result.props.children[5];
      });

      it('comes up as closed', () => {
        expect(closedDay.props.children)
          .toEqual('Closed');
      });
    });
  });
});
