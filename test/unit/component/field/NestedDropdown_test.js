describe('NestedDropdown component', () => {
  let NestedDropdown,
    mockOptions = [
      {
        name: 'pizza',
        value: 'pizza'
      },
      {
        name: 'ice cream',
        value: 'ice cream'
      },
      {
        name: 'fruits::apple',
        value: 'fruits__apple',
        default: true
      },
      {
        name: 'fruits::banana',
        value: 'fruits__banana'
      },
      {
        name: 'vegetable::carrot',
        value: 'vegetable__carrot'
      },
      {
        name: 'vegetable',
        value: 'vegetable'
      }
    ];

  const SelectField = noopReactComponent();
  const Item = noopReactComponent();
  const NextItem = noopReactComponent();
  const PreviousItem = noopReactComponent();
  const Separator = noopReactComponent();
  const nestedDropdownPath = buildSrcPath('component/field/NestedDropdown');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      '@zendeskgarden/react-select': {
        SelectField,
        Label: noopReactComponent(),
        Item,
        Select: noopReactComponent(),
        Separator,
        NextItem,
        PreviousItem
      },
    });

    mockery.registerAllowable(nestedDropdownPath);
    NestedDropdown = requireUncached(nestedDropdownPath).NestedDropdown;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('instance variables', () => {
    let component,
      groupedOptions,
      formattedOptions,
      topLevel;

    beforeEach(() => {
      component = instanceRender(
        <NestedDropdown options={mockOptions} />
      );
      groupedOptions = component.groupedOptions;
      formattedOptions = component.formattedOptions;
      topLevel = component.topLevel;
    });

    describe('groupedOptions', () => {
      it('equals the options grouped by their name value', () => {
        expect(groupedOptions)
          .toEqual({
            'pizza': { name: 'pizza', value: 'pizza' },
            'ice cream': { name: 'ice cream', value: 'ice cream' },
            'fruits': { name: 'fruits', value: 'fruits-nested' },
            'fruits::apple': { name: 'fruits::apple', value: 'fruits__apple', default: true },
            'fruits::banana': { name: 'fruits::banana', value: 'fruits__banana' },
            'vegetable::carrot': { name: 'vegetable::carrot', value: 'vegetable__carrot' },
            'vegetable': { name: 'vegetable', value: 'vegetable' }
          });
      });
    });

    describe('formattedOptions', () => {
      it('equals the groupedOptions converted to the correct item type', () => {
        _.forEach(formattedOptions, (option, key) => {
          const nextItemKeys = key === 'vegetable' || key === 'fruits';

          expect(TestUtils.isElementOfType(option, nextItemKeys ? NextItem : Item))
            .toEqual(true);
        });
      });
    });

    describe('topLevel', () => {
      it('equals just the items in the initial menu screen', () => {
        expect(topLevel.length)
          .toEqual(4);
      });
    });
  });

  describe('handleChange', () => {
    let component,
      selectedKey;

    beforeEach(() => {
      component = instanceRender(
        <NestedDropdown options={mockOptions} />
      );
      component.setState({ displayedKey: 'initial' });
      component.handleChange(selectedKey);
    });

    describe('when a key with -prev is passed in', () => {
      beforeAll(() => {
        selectedKey = 'apple-prev';
      });

      it('strips off the -prev and saves it as the selectedKey state', () => {
        expect(component.state.selectedKey)
          .toEqual('apple');
      });

      it('does not change the state of the displayedKey', () => {
        expect(component.state.displayedKey)
          .toEqual('initial');
      });
    });

    describe('when a key with -next is passed in', () => {
      beforeAll(() => {
        selectedKey = 'fruit-next';
      });

      it('strips off the -next and saves it as the selectedKey state', () => {
        expect(component.state.selectedKey)
          .toEqual('fruit');
      });

      it('does not change the state of the displayedKey', () => {
        expect(component.state.displayedKey)
          .toEqual('initial');
      });
    });

    describe('when another key is passed in', () => {
      beforeAll(() => {
        selectedKey = 'pizza';
      });

      it('saves it as the selectedKey state', () => {
        expect(component.state.selectedKey)
          .toEqual('pizza');
      });

      it('saves it as the displayedKey state', () => {
        expect(component.state.displayedKey)
          .toEqual('pizza');
      });
    });
  });

  describe('retrieveMenuItems', () => {
    let component,
      selectedKey,
      menuItems;

    beforeEach(() => {
      component = domRender(
        <NestedDropdown options={mockOptions} />
      );
      menuItems = component.retrieveMenuItems(selectedKey);
    });

    describe('when selectedKey is undefined', () => {
      beforeAll(() => {
        selectedKey = undefined;
      });

      it('returns the top level items', () => {
        expect(menuItems)
          .toEqual(component.topLevel);
      });
    });

    describe('when selectedKey is an NextItem with nested items', () => {
      beforeAll(() => {
        selectedKey = 'vegetable';
      });

      it('returns the menu containing the nested items', () => {
        expect(menuItems.length)
          .toEqual(3);
      });

      it('has a PreviousItem as the first element', () => {
        expect(TestUtils.isElementOfType(menuItems[0], PreviousItem))
          .toEqual(true);
      });

      it('has a Seperator as the second element', () => {
        expect(TestUtils.isElementOfType(menuItems[1], Separator))
          .toEqual(true);
      });

      it('has a Item as the third element', () => {
        expect(TestUtils.isElementOfType(menuItems[2], Item))
          .toEqual(true);
      });
    });

    describe('when selectedKey is an Item within a nested menu', () => {
      beforeAll(() => {
        selectedKey = 'vegetable__carrot';
      });

      it('returns the currently nested menu', () => {
        expect(menuItems.length)
          .toEqual(3);

        expect(TestUtils.isElementOfType(menuItems[0], PreviousItem))
          .toEqual(true);
      });
    });
  });

  describe('render', () => {
    let component;

    beforeEach(() => {
      component = domRender(
        <NestedDropdown options={mockOptions} />
      );
    });

    describe('when no value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        displayedValue = component.render().props.children[0].props.children[1].props.children;
      });

      it('displays the default value of -', () => {
        expect(displayedValue)
          .toEqual('-');
      });
    });

    describe('when a value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        component.setState({ displayedKey: 'pizza' });
        displayedValue = component.render().props.children[0].props.children[1].props.children;
      });

      it('displays the name of the value', () => {
        expect(displayedValue)
          .toEqual('pizza');
      });
    });

    describe('when a nested value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        component.setState({ displayedKey: 'fruits__apple' });
        displayedValue = component.render().props.children[0].props.children[1].props.children;
      });

      it('displays the last section of the name of the value', () => {
        expect(displayedValue)
          .toEqual('apple');
      });
    });
  });
});
