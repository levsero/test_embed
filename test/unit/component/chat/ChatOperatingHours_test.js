describe('ChatOperatingHours component', () => {
  let ChatOperatingHours;
  let locale = 'en';
  const ChatOperatingHoursPath = buildSrcPath('component/chat/ChatOperatingHours');
  const Button = noopReactComponent();
  const SelectField = noopReactComponent();
  const Item = noopReactComponent();
  const i18nTimeFromMinutes = jasmine.createSpy('i18nTimeFromMinutes');

  const mockAccountOperatingHours = {
    account_schedule: [
      {
        days: [1, [3, 5], 7],
        periods: [{ start: 456, end: 789 }]
      },
      {
        days: [2, 6],
        periods: []
      }
    ],
    type: 'account',
    enabled: true,
    timezone: 'Australia/Melbourne'
  };
  const mockDepartmentOperatingHours = {
    department_schedule: [
      {
        name: 'Sales',
        id: 111,
        schedule: [
          {
            days: [1, [3, 5], 7],
            periods: [{ start: 456, end: 789 }]
          },
          {
            days: [2, 6],
            periods: []
          }
        ]
      },
      {
        name: 'Billing',
        id: 222,
        schedule: [
          {
            days: [1, [3, 5], 7],
            periods: [{ start: 456, end: 789 }]
          },
          {
            days: [2, 6],
            periods: []
          }
        ]
      }
    ],
    type: 'department',
    enabled: true,
    timezone: 'Australia/Melbourne'
  };

  const mockDepartmentOperatingHoursWithManySchedules = {
    department_schedule: [
      {
        name: 'Sales',
        id: 111,
        schedule: [
          {
            days: [1, [3, 6]],
            periods: [{ start: 456, end: 789 }]
          },
          {
            days: [2],
            periods: [{ start: 800, end: 900 }]
          },
          {
            days: [7],
            periods: [{ start: 456, end: 789 }, { start: 800, end: 900 }]
          }
        ]
      }
    ],
    type: 'department',
    enabled: true,
    timezone: 'Australia/Melbourne'
  };

  beforeEach(() => {
    mockery.enable();

    i18nTimeFromMinutes.calls.reset();

    initMockRegistry({
      './ChatOperatingHours.scss': {
        locals: {
          container: 'containerClass',
          title: 'titleClass',
          singleDay: 'singleDayClass',
          dayName: 'dayNameClass',
          button: 'buttonClass',
          lastTiming: 'lastTiming'
        }
      },
      'service/i18n': {
        i18n: {
          t: (...args) => args,
          getLocale: () => locale
        }
      },
      '@zendeskgarden/react-buttons': { Button },
      '@zendeskgarden/react-select': {
        SelectField,
        Label: noopReactComponent(),
        Item,
        Select: noopReactComponent()
      },
      'utility/time': { i18nTimeFromMinutes },
      'src/constants/shared': {
        FONT_SIZE: 14
      },
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
        expect(title.props.dangerouslySetInnerHTML.__html[0])
          .toEqual('embeddable_framework.chat.operatingHours.label.title');
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

  describe('use locales specific clock', () => {
    let component;

    it('passes locale correctly to i18nTimeFromMinutes', () => {
      locale = 'ja';
      component = instanceRender(
        <ChatOperatingHours
          operatingHours={mockAccountOperatingHours} />
      );
      component.render();

      expect(i18nTimeFromMinutes)
        .toHaveBeenCalledWith(456, locale);
      expect(i18nTimeFromMinutes)
        .toHaveBeenCalledWith(789, locale);
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

    it('has the right children prop', () => {
      expect(result.props.children[0]).toEqual('embeddable_framework.common.button.goBack');
    });

    it('has the right onClick prop', () => {
      expect(result.props.onClick).toEqual(jasmine.any(Function));
    });
  });

  describe('formatDepartmentsForDropdown', () => {
    let component, result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
      );

      result = component.formatDepartmentsForDropdown();
    });

    it('returns an array of formatted departments', () => {
      const expected = [
        <Item key={111}>Sales</Item>,
        <Item key={222}>Billing</Item>
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

    it('calls setState with the selected department', () => {
      expect(component.setState)
        .toHaveBeenCalledWith({ activeDepartment: 123 });
    });
  });

  describe('getSelectedDepartmentSchedule', () => {
    let component, result;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={mockDepartmentOperatingHours} />
      );
      component.setState({ activeDepartment: '222' });

      result = component.getSelectedDepartmentSchedule();
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

        spyOn(component, 'getSelectedDepartmentSchedule').and.returnValue({ schedule: 'mockSelectedDept' });
        spyOn(component, 'formatDepartmentsForDropdown').and.returnValue(mockFormattedDropdowns);
        spyOn(component, 'renderSchedule');

        result = component.renderDepartmentSchedule();
        dropdown = result.props.children[0];
      });

      it('renders a SelectField component', () => {
        expect(TestUtils.isElementOfType(dropdown, SelectField))
          .toEqual(true);
      });

      it('passes the formattedDepartments in to the dropdown as options', () => {
        expect(dropdown.props.children[1].props.options)
          .toEqual(mockFormattedDropdowns);
      });

      it('passes the first formattedDepartment in to the dropdown as value', () => {
        expect(dropdown.props.children[1].props.selectedKey)
          .toEqual('111');
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
      range,
      operatingHours;

    beforeEach(() => {
      component = instanceRender(
        <ChatOperatingHours operatingHours={operatingHours} />
      );
      result = component.renderSchedule(operatingHours.account_schedule || operatingHours.department_schedule[0].schedule);
    });

    describe('when using an account schedule', () => {
      beforeAll(() => {
        operatingHours = mockAccountOperatingHours;
      });

      it('returns a definition pair for every grouped days of the week', () => {
        expect(result.props.children.length).toEqual(4);
      });

      _.times(2, (dayIndex) => {
        describe(`on group ${dayIndex}`, () => {
          beforeEach(() => {
            dayName = result.props.children[dayIndex * 2];
            range = result.props.children[dayIndex * 2 + 1];
          });

          it(`contains information about group ${dayIndex} is the right element`, () => {
            expect(dayName.type).toEqual('dt');
          });

          it(`has the right className prop for group ${dayIndex}`, () => {
            expect(dayName.props.className).toEqual('dayNameClass');
          });

          it(`has the right className for the hour range on group ${dayIndex}`, () => {
            expect(range.props.className).toEqual('lastTiming');
          });

          it(`contains information about the range on group ${dayIndex} in the right element`, () => {
            expect(range.type).toEqual('dd');
          });
        });
      });

      describe('for days with opening hours', () => {
        let openDayRange;

        beforeEach(() => {
          openDayRange = result.props.children[1];
        });

        it('contains a string with the range of hours', () => {
          expect(openDayRange.props.children[0])
            .toEqual('embeddable_framework.chat.operatingHours.label.timeRange');
        });
      });

      describe('for days without opening hours', () => {
        let closedDay;

        beforeEach(() => {
          closedDay = result.props.children[3];
        });

        it('comes up as closed', () => {
          expect(closedDay.props.children[0])
            .toEqual('embeddable_framework.chat.operatingHours.label.closed');
        });
      });
    });

    describe('when there are many schedules to one deparment', () => {
      beforeAll(() => {
        operatingHours = mockDepartmentOperatingHoursWithManySchedules;
      });

      it('returns correct number of day items to render', () => {
        expect(result.props.children.length).toEqual(7);
      });

      _.times(3, (dayIndex) => {
        describe(`on group ${dayIndex}`, () => {
          beforeEach(() => {
            range = result.props.children[dayIndex * 2 + (dayIndex === 2 ? 2 : 1)];
          });

          it(`has the right className for the hour range on group ${dayIndex}`, () => {
            expect(range.props.className).toEqual('lastTiming');
          });

          it(`contains information about the range on group ${dayIndex} in the right element`, () => {
            expect(range.type).toEqual('dd');
          });
        });
      });
    });
  });
});
