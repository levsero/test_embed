import { timeFromMinutes } from '../../../../src/util/time';

describe('ChatOperatingHours component', () => {
  let ChatOperatingHours;
  const ChatOperatingHoursPath = buildSrcPath('component/chat/ChatOperatingHours');
  const Dropdown = noopReactComponent();
  const Button = noopReactComponent();

  const mockAccountOperatingHours = {
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
  const mockDepartmentOperatingHours = {
    department_schedule: [
      {
        name: 'Sales',
        id: 111,
        0: [{start: 456, end: 789}],
        1: [{start: 456, end: 789}],
        2: [],
        3: [{start: 456, end: 789}],
        4: [{start: 456, end: 789}],
        5: [{start: 456, end: 789}],
        6: []
      },
      {
        name: 'Billing',
        id: 222,
        0: [{start: 456, end: 789}],
        1: [{start: 456, end: 789}],
        2: [],
        3: [{start: 456, end: 789}],
        4: [{start: 456, end: 789}],
        5: [{start: 456, end: 789}],
        6: []
      }
    ],
    enabled: true,
    timezone: 'Australia/Melbourne'
  };

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
      'component/button/Button': { Button },
      'component/field/Dropdown': { Dropdown },
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
          operatingHours={mockAccountOperatingHours} />
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
        expect(title.props.dangerouslySetInnerHTML)
          .toEqual({ __html: 'embeddable_framework.chat.operatingHours.label.title' });
      });
    });

    describe('the list of days', () => {
      let list;

      beforeEach(() => {
        list = result.props.children[1];
      });

      it('is contained in the right element', () => {
        expect(list.type).toEqual('dl');
      });
    });
  });

  describe('renderBackButton', () => {
    let component,
      result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours
          handleOfflineFormBack={() => {}}
          operatingHours={mockAccountOperatingHours} />
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
      expect(result.props.label).toEqual('embeddable_framework.common.button.goBack');
    });

    it('has the right onClick prop', () => {
      expect(result.props.onClick).toEqual(jasmine.any(Function));
    });

    it('has the right type prop', () => {
      expect(result.props.type).toEqual('button');
    });
  });

  describe('formatDepartments', () => {
    let component, result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
      );

      result = component.formatDepartments();
    });

    it('returns an array of formatted departments', () => {
      const expected = [
        {
          name: 'Sales',
          value: 111
        },
        {
          name: 'Billing',
          value: 222
        }
      ];

      expect(result)
        .toEqual(expected);
    });
  });

  describe('setActiveDepartment', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
      );
      spyOn(component, 'setState');

      component.setActiveDepartment(123);
    });

    it('returns the selected department', () => {
      expect(component.setState)
        .toHaveBeenCalledWith({ activeDepartment: 123 });
    });
  });

  describe('getSelectedDepartment', () => {
    let component, result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
      );
      component.setState({ activeDepartment: 222 });

      result = component.getSelectedDepartment();
    });

    it('returns the selected department', () => {
      expect(result)
        .toEqual(mockDepartmentOperatingHours.department_schedule[1]);
    });
  });

  describe('renderDepartmentSchedule', () => {
    let component,
      result,
      dropdown;
    const mockFormattedDropdowns = [
      { name: 'Billing', value: 123 },
      { name: 'Sales', value: 321 }
    ];

    describe('when department operating hours exist', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
        );

        spyOn(component, 'getSelectedDepartment').and.returnValue('mockSelectedDept');
        spyOn(component, 'formatDepartments').and.returnValue(mockFormattedDropdowns);
        spyOn(component, 'renderSchedule');

        result = component.renderDepartmentSchedule();
        dropdown = result.props.children[0];
      });

      it('renders a dropdown component', () => {
        expect(TestUtils.isElementOfType(dropdown, Dropdown))
          .toEqual(true);
      });

      it('passes the formattedDepartments in to the dropdown as options', () => {
        expect(dropdown.props.options)
          .toEqual(mockFormattedDropdowns);
      });

      it('passes the first formattedDepartment in to the dropdown as value', () => {
        expect(dropdown.props.value)
          .toEqual(mockFormattedDropdowns[0]);
      });

      it('calls renderSchedule with the departments schedule', () => {
        expect(component.renderSchedule)
          .toHaveBeenCalledWith('mockSelectedDept');
      });
    });

    describe('when account operating hours exist', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOperatingHours operatingHours={mockAccountOperatingHours} />
        );

        result = component.renderDepartmentSchedule();
      });

      it('does not render anything', () => {
        expect(result)
          .toBeFalsy();
      });
    });
  });

  describe('renderAccountSchedule', () => {
    let component,
      result;

    describe('when account operating hours exist', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOperatingHours operatingHours={mockAccountOperatingHours} />
        );

        spyOn(component, 'renderSchedule');

        result = component.renderAccountSchedule();
      });

      it('calls renderSchedule with the account schedule', () => {
        expect(component.renderSchedule)
          .toHaveBeenCalledWith(mockAccountOperatingHours.account_schedule);
      });
    });

    describe('when departments operating hours exist', () => {
      beforeEach(() => {
        component = instanceRender(
          <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
        );

        result = component.renderAccountSchedule();
      });

      it('does not render anything', () => {
        expect(result)
          .toBeFalsy();
      });
    });
  });

  describe('renderSchedule', () => {
    let component,
      result,
      dayName,
      range;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={mockAccountOperatingHours} />
      );

      result = component.renderSchedule(mockAccountOperatingHours.account_schedule);
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
          .toEqual('embeddable_framework.chat.operatingHours.label.closed');
      });
    });
  });
});
