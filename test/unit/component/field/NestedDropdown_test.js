describe('NestedDropdown component', () => {
  let NestedDropdown,
    mockOptions = [
      {
        name: 'pizzaName',
        value: 'pizza'
      },
      {
        name: 'ice cream',
        value: 'ice cream'
      },
      {
        name: 'ice',
        value: 'ice'
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
  const Message = noopReactComponent();
  const Icon = noopReactComponent();
  const nestedDropdownPath = buildSrcPath('component/field/Dropdown/NestedDropdown');
  const optionNodePath = buildSrcPath('component/field/Dropdown/OptionNode');
  const OptionNode = requireUncached(optionNodePath);

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './NestedDropdown.scss': {
        locals: {}
      },
      '@zendeskgarden/react-select': {
        SelectField,
        Label: noopReactComponent(),
        Item,
        Select: noopReactComponent(),
        Hint: noopReactComponent(),
        Separator,
        NextItem,
        PreviousItem,
        Message
      },
      'component/Icon': {
        Icon
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      'constants/shared': {
        FONT_SIZE: 14
      },
      'component/field/Dropdown/OptionNode': OptionNode
    });

    mockery.registerAllowable(nestedDropdownPath);
    NestedDropdown = requireUncached(nestedDropdownPath).NestedDropdown;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('initial state', () => {
    let component;

    describe('when no defaultOption is passed in', () => {
      beforeEach(() => {
        component = instanceRender(
          <NestedDropdown options={mockOptions} />
        );
      });

      it('selectedValue is empty', () => {
        expect(component.state.selectedValue)
          .toEqual('');
      });

      it('displayedName is -', () => {
        expect(component.state.displayedName)
          .toEqual('-');
      });

      it('viewableNode points to the root node', () => {
        expect(component.state.viewableNode.parentNode)
          .toBeNull();

        expect(component.state.viewableNode.name)
          .toEqual('');

        expect(component.state.viewableNode.value)
          .toEqual('');
      });
    });

    describe('when a defaultOption is passed in', () => {
      beforeEach(() => {
        component = instanceRender(
          <NestedDropdown options={mockOptions} defaultOption={{ name: 'pizzaName', value: 'pizza' }} />
        );
      });

      it('uses provided value', () => {
        expect(component.state.selectedValue)
          .toEqual('pizza');
      });

      it('uses provided name', () => {
        expect(component.state.displayedName)
          .toEqual('pizzaName');
      });

      it('viewableNode points to the parent of default option', () => {
        expect(component.state.viewableNode.parentNode)
          .toBeNull();

        expect(component.state.viewableNode.name)
          .toEqual('');

        expect(component.state.viewableNode.value)
          .toEqual('');

        expect(component.state.viewableNode.getChildNode('pizzaName').name)
          .toEqual('pizzaName');

        expect(component.state.viewableNode.getChildNode('pizzaName').value)
          .toEqual('pizza');
      });
    });
  });

  describe('populateGraph', () => {
    let rootNode,
      component;

    beforeEach(() => {
      component = instanceRender(
        <NestedDropdown options={mockOptions} />
      );
      rootNode = component.rootNode;
    });

    it('renders the pizzaName option correctly', () => {
      const optionNode = rootNode.getChildNode('pizzaName');

      expect(optionNode.name)
        .toEqual('pizzaName');

      expect(optionNode.value)
        .toEqual('pizza');

      expect(optionNode.hasChildren())
        .toEqual(false);
    });

    it('renders the ice cream option correctly', () => {
      const optionNode = rootNode.getChildNode('ice cream');

      expect(optionNode.name)
        .toEqual('ice cream');

      expect(optionNode.value)
        .toEqual('ice cream');

      expect(optionNode.hasChildren())
        .toEqual(false);
    });

    it('renders the ice option correctly', () => {
      const optionNode = rootNode.getChildNode('ice');

      expect(optionNode.name)
        .toEqual('ice');

      expect(optionNode.value)
        .toEqual('ice');

      expect(optionNode.hasChildren())
        .toEqual(false);
    });

    it('renders the vegetable nested (selectable) option correctly', () => {
      const optionNode = rootNode.getChildNode('vegetable');

      expect(optionNode.name)
        .toEqual('vegetable');

      expect(optionNode.value)
        .toEqual('vegetable');

      expect(optionNode.hasChildren())
        .toEqual(true);
    });

    it('renders the carrot option correctly', () => {
      const optionNode = rootNode.getChildNode('vegetable').getChildNode('carrot');

      expect(optionNode.name)
        .toEqual('carrot');

      expect(optionNode.value)
        .toEqual('vegetable__carrot');

      expect(optionNode.hasChildren())
        .toEqual(false);
    });

    it('renders the fruits nested (not selectable) option correctly', () => {
      const optionNode = rootNode.getChildNode('fruits');

      expect(optionNode.name)
        .toEqual('fruits');

      expect(optionNode.value)
        .toEqual('fruits-nested');

      expect(optionNode.hasChildren())
        .toEqual(true);
    });

    it('renders the apple option correctly', () => {
      const optionNode = rootNode.getChildNode('fruits').getChildNode('apple');

      expect(optionNode.name)
        .toEqual('apple');

      expect(optionNode.value)
        .toEqual('fruits__apple');

      expect(optionNode.hasChildren())
        .toEqual(false);
    });

    it('renders the banana option correctly', () => {
      const optionNode = rootNode.getChildNode('fruits').getChildNode('banana');

      expect(optionNode.name)
        .toEqual('banana');

      expect(optionNode.value)
        .toEqual('fruits__banana');

      expect(optionNode.hasChildren())
        .toEqual(false);
    });

    it('does not render an incorrect deep option', () => {
      const optionNode = rootNode.getChildNode('fruits').getChildNode('carrot');

      expect(optionNode)
        .toBeUndefined();
    });
  });

  describe('handleSelectedItem', () => {
    let component,
      selectedKey,
      mockDisplayedName,
      mockSelectedValue,
      mockNode;
    const onChangeSpy = jasmine.createSpy('onChange');

    beforeAll(() => {
      component = instanceRender(
        <NestedDropdown options={mockOptions} onChange={onChangeSpy} />
      );
    });

    beforeEach(() => {
      jasmine.clock().install();

      component.setState({
        displayeName: mockDisplayedName,
        selectedValue: mockSelectedValue,
        viewableNode: mockNode
      });
      component.handleSelectedItem(selectedKey);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe('when item selected is a leaf', () => {
      beforeAll(() => {
        mockDisplayedName = '';
        mockSelectedValue = '';
        mockNode = component.rootNode;
        selectedKey = 'pizzaName';
      });

      it('updates selected value', () => {
        expect(component.state.selectedValue)
          .toEqual('pizza');
      });

      it('updates the displayedName', () => {
        expect(component.state.displayedName)
          .toEqual('pizzaName');
      });

      it('does not update viewableNode since selected item is a leaf node', () => {
        expect(component.state.viewableNode)
          .toEqual(mockNode);
      });

      it('calls props.onChange', () => {
        jasmine.clock().tick();

        expect(onChangeSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when item selected is not a leaf and not selectable', () => {
      beforeAll(() => {
        mockDisplayedName = '';
        mockSelectedValue = 'someVal';
        mockNode = component.rootNode;
        selectedKey = 'fruits';
      });

      it('updates selected value to be nothing since the option is not selectable', () => {
        expect(component.state.selectedValue)
          .toEqual('');
      });

      it('updates the displayedName', () => {
        expect(component.state.displayedName)
          .toEqual('fruits');
      });

      it('updates viewableNode since selected value is not a leaf', () => {
        expect(component.state.viewableNode)
          .toEqual(mockNode.getChildNode('fruits'));
      });

      it('calls props.onChange', () => {
        jasmine.clock().tick();

        expect(onChangeSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when item selected is not a leaf and selectable', () => {
      beforeAll(() => {
        mockDisplayedName = '';
        mockSelectedValue = 'someVal';
        mockNode = component.rootNode;
        selectedKey = 'vegetable';
      });

      it('updates selected value since it is selectable', () => {
        expect(component.state.selectedValue)
          .toEqual('vegetable');
      });

      it('updates the displayedName', () => {
        expect(component.state.displayedName)
          .toEqual('vegetable');
      });

      it('updates viewableNode since selected value is not a leaf', () => {
        expect(component.state.viewableNode)
          .toEqual(mockNode.getChildNode('vegetable'));
      });

      it('calls props.onChange', () => {
        jasmine.clock().tick();

        expect(onChangeSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when item selected is parent', () => {
      beforeAll(() => {
        mockDisplayedName = 'apple';
        mockSelectedValue = 'fruits__apple';
        mockNode = component.rootNode.getChildNode('fruits');
        selectedKey = '--prev';
      });

      it('updates selected value', () => {
        expect(component.state.selectedValue)
          .toEqual('');
      });

      it('updates the displayedName', () => {
        expect(component.state.displayedName)
          .toEqual('');
      });

      it('updates viewableNode since selected value is not a leaf', () => {
        expect(component.state.viewableNode)
          .toEqual(mockNode.parentNode);
      });

      it('calls props.onChange', () => {
        jasmine.clock().tick();

        expect(onChangeSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('renderCurrentLevelItems', () => {
    let component,
      menuItems;

    beforeEach(() => {
      component = domRender(
        <NestedDropdown options={mockOptions} />
      );
    });

    describe('when viewableNode is not at root level', () => {
      beforeEach(() => {
        component.state.viewableNode = component.rootNode.getChildNode('fruits');
        menuItems = component.renderCurrentLevelItems();
      });

      it('renders previous item', () => {
        expect(TestUtils.isElementOfType(menuItems[0], PreviousItem))
          .toEqual(true);
        expect(menuItems[0].key)
          .toEqual('--prev');
        expect(menuItems[0].props.children[1])
          .toEqual('fruits');
      });

      it('renders Separator', () => {
        expect(TestUtils.isElementOfType(menuItems[1], Separator))
          .toEqual(true);
        expect(menuItems[1].key)
          .toEqual('fruits--separator');
      });

      it('renders the apple child item', () => {
        expect(TestUtils.isElementOfType(menuItems[2], Item))
          .toEqual(true);
        expect(menuItems[2].key)
          .toEqual('apple');
        expect(menuItems[2].props.children)
          .toEqual('apple');
      });

      it('renders the banana child item', () => {
        expect(TestUtils.isElementOfType(menuItems[3], Item))
          .toEqual(true);
        expect(menuItems[3].key)
          .toEqual('banana');
        expect(menuItems[3].props.children)
          .toEqual('banana');
      });
    });

    describe('when viewableNode is at root level', () => {
      beforeEach(() => {
        component.state.viewableNode = component.rootNode;
        menuItems = component.renderCurrentLevelItems();
      });

      it('does not render previous item', () => {
        expect(TestUtils.isElementOfType(menuItems[0], PreviousItem))
          .toEqual(false);
      });

      it('does not render Separator', () => {
        expect(TestUtils.isElementOfType(menuItems[1], Separator))
          .toEqual(false);
      });

      it('renders the pizza item', () => {
        expect(TestUtils.isElementOfType(menuItems[0], Item))
          .toEqual(true);
        expect(menuItems[0].key)
          .toEqual('pizzaName');
        expect(menuItems[0].props.children)
          .toEqual('pizzaName');
      });

      it('renders ice cream item', () => {
        expect(TestUtils.isElementOfType(menuItems[1], Item))
          .toEqual(true);
        expect(menuItems[1].key)
          .toEqual('ice cream');
        expect(menuItems[1].props.children)
          .toEqual('ice cream');
      });

      it('renders the ice item', () => {
        expect(TestUtils.isElementOfType(menuItems[2], Item))
          .toEqual(true);
        expect(menuItems[2].key)
          .toEqual('ice');
        expect(menuItems[2].props.children)
          .toEqual('ice');
      });

      it('renders the fruit item', () => {
        expect(TestUtils.isElementOfType(menuItems[3], NextItem))
          .toEqual(true);
        expect(menuItems[3].key)
          .toEqual('fruits');
        expect(menuItems[3].props.children)
          .toEqual('fruits');
      });

      it('renders the vegetable item', () => {
        expect(TestUtils.isElementOfType(menuItems[4], NextItem))
          .toEqual(true);
        expect(menuItems[4].key)
          .toEqual('vegetable');
        expect(menuItems[4].props.children)
          .toEqual('vegetable');
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
        displayedValue = component.render().props.children[0].props.children[2].props.children;
      });

      it('displays the default value', () => {
        expect(displayedValue)
          .toEqual('-');
      });
    });

    describe('when a value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        component.setState({ displayedName: 'pizzaName' });
        displayedValue = component.render().props.children[0].props.children[2].props.children;
      });

      it('displays the name of the value', () => {
        expect(displayedValue)
          .toEqual('pizzaName');
      });
    });

    describe('when a nested value is selected', () => {
      let displayedValue;

      beforeEach(() => {
        component.setState({ displayedName: 'apple' });
        displayedValue = component.render().props.children[0].props.children[2].props.children;
      });

      it('displays the last section of the name of the value', () => {
        expect(displayedValue)
          .toEqual('apple');
      });
    });

    describe('when showError is true', () => {
      let errorComponent;

      beforeEach(() => {
        component = domRender(
          <NestedDropdown options={mockOptions} showError={true} />
        );
        errorComponent = component.render().props.children[0].props.children[3];
      });

      it('renders a Message component', () => {
        expect(TestUtils.isElementOfType(errorComponent, Message))
          .toEqual(true);
      });
    });

    describe('when showError is false', () => {
      let errorComponent;

      beforeEach(() => {
        component = domRender(
          <NestedDropdown options={mockOptions} showError={false} />
        );
        errorComponent = component.render().props.children[0].props.children[3];
      });

      it('does not render a Message component', () => {
        expect(TestUtils.isElementOfType(errorComponent, Message))
          .toEqual(false);
      });
    });
  });
});
