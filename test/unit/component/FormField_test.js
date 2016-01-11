describe('FormField component', function() {
  let onSearch,
    onChangeValue,
    onClick,
    SearchField,
    SearchFieldButton,
    Field,
    getCustomFields;
  const formFieldPath = buildSrcPath('component/FormField');

  beforeEach(function() {
    onSearch = jasmine.createSpy();
    onChangeValue = jasmine.createSpy('onChangeValue');
    onClick = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'react/addons': React,
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'component/Icon': {
        Icon: React.createClass({
          render: function() {
            return (
              <span
                className={`Icon ${this.props.type}`}
                onClick={this.props.onClick}>
                <svg />
              </span>
            );
          }
        })
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return true;
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocale',
          't',
          'isRTL',
          'getLocaleId'
        ])
      }
    });

    mockery.registerAllowable(formFieldPath);

    SearchField = requireUncached(formFieldPath).SearchField;
    SearchFieldButton = requireUncached(formFieldPath).SearchFieldButton;
    Field = requireUncached(formFieldPath).Field;
    getCustomFields = requireUncached(formFieldPath).getCustomFields;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Field', function() {
    it('should render form field DOM with a label wrapping two child divs', function() {
      const field = React.render(
        <Field name='alice' />,
        global.document.body
      );
      const fieldNode = field.getDOMNode();

      expect(fieldNode.nodeName)
        .toEqual('LABEL');

      expect(fieldNode.children.length)
        .toEqual(2);

      expect(fieldNode.children[0].nodeName)
        .toEqual('DIV');

      expect(fieldNode.children[1].nodeName)
        .toEqual('DIV');
    });

    it('should pass along all props to underlying input', function() {
      const field = React.render(
        <Field
          type='email'
          name='alice' />,
        global.document.body
      );
      const fieldNode = field.getDOMNode();

      expect(fieldNode.querySelector('input').name)
        .toEqual('alice');

      expect(fieldNode.querySelector('input').type)
        .toEqual('email');
    });

    it('should render input prop component instead of default input', function() {
      const field = React.render(
        <Field
          input={
            <textarea />
          }
          name='alice' />,
        global.document.body
      );
      const fieldNode = field.getDOMNode();

      expect(fieldNode.querySelector('input'))
        .toBeFalsy();

      expect(fieldNode.querySelector('textarea'))
        .toBeTruthy();

      expect(fieldNode.querySelector('textarea').name)
        .toEqual('alice');
    });

    it('should render checkbox with label instead of default input', function() {
      const field = React.render(
        <Field
          label='Agree?'
          type='checkbox'
          name='alice' />,
        global.document.body
      );
      const fieldNode = field.getDOMNode();

      expect(fieldNode.querySelector('input').type)
        .toEqual('checkbox');

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(field, 'Form-checkboxCaption'))
        .toBeTruthy();
    });

    it('should set focused state on field focus', function() {
      const field = React.render(
        <Field
          name='alice' />,
        global.document.body
      );
      const fieldNode = field.getDOMNode();

      expect(field.state.focused)
        .toBe(false);

      ReactTestUtils.Simulate.focus(fieldNode.querySelector('input'));

      expect(field.state.focused)
        .toBe(true);

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--focused'))
        .toBeTruthy();
    });

    it('should only set invalid class after focus and blur events', function() {
      const field = React.render(
        <Field
          name='alice' />,
        global.document.body
      );
      const fieldNode = field.getDOMNode();

      // jsdom doesn't seem to support html5 validation api
      // shim it for this test
      fieldNode.querySelector('input').validity = {
        valid: false
      };

      expect(field.state.hasError)
        .toBe(false);

      expect(() => ReactTestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--invalid'))
        .toThrow();

      ReactTestUtils.Simulate.focus(fieldNode.querySelector('input'));
      ReactTestUtils.Simulate.blur(fieldNode.querySelector('input'));

      expect(field.state.hasError)
        .toBe(true);

      expect(field.state.focused)
        .toBe(false);

      expect(field.state.blurred)
        .toBe(true);

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--invalid'))
        .toBeTruthy();
    });
  });

  it('should have mobile classes when isMobileBrowser is true', function() {
    const field = React.render(
      <Field />,
      global.document.body
    );
    const fieldNode = field.getDOMNode();

    expect(fieldNode.childNodes[0].className)
      .toMatch('u-textSize15');
  });

  it('should not have mobile classes when isMobileBrowser is false', function() {
    mockery.registerMock('utility/devices', {
      isMobileBrowser: function() {
        return false;
      }
    });

    Field = requireUncached(formFieldPath).Field;

    const field = React.render(
      <Field />,
      global.document.body
    );
    const fieldNode = field.getDOMNode();

    expect(fieldNode.childNodes[0].className)
      .not.toMatch('u-textSize15');
  });

  describe('getCustomFields', function() {
    it('should convert custom field payload into array of React components', function() {
      const payload = [
        {
          id: '22660514',
          type: 'text',
          title: 'Text',
          required: true,
          variants: [
            {
              localeId: 1,
              content: 'Option 1'
            },
            {
              localeId: 16,
              content: 'FrenchField'
            }
          ]
        },
        {
          id: 10006,
          type: 'tagger',
          title: 'Nested Drop Down',
          required: false,
          options: [
            {
              title: 'Option1::Part1',
              value: 'option1__part1'
            },
            {
              title: 'Option2::Part2',
              value: 'option2__part2'
            },
            {
              title: 'Option1::Part2',
              value: 'option1__part2'
            }
          ]
        },
        {
          id: '22666574',
          type: 'tagger',
          title: 'Department',
          variants: [
            {
              localeId: 1,
              content: 'Drop Down English'
            },
            {
              localeId: 16,
              content: 'Drop Down français'
            }
          ],
          options: [
            {
              title: 'Sales',
              value: 1,
              variants: [
                {
                  localeId: 1,
                  content: 'English'
                },
                {
                  localeId: 16,
                  content: 'French'
                }
              ]
            },
            {
              title: 'Support',
              value: 2
            }
          ],
          required: true
        },
        {
          id: '22660524',
          type: 'textarea',
          title: 'Order Details',
          required: true
        },
        {
          id: '22823250',
          type: 'integer',
          title: 'Age',
          required: true
        },
        {
          id: '22823260',
          type: 'decimal',
          title: 'Total Cost',
          required: true
        },
        {
          id: '22823270',
          type: 'checkbox',
          title: 'Can we call you?',
          required: false
        }
      ];
      const customFields = getCustomFields(payload, {});

      expect(Object.keys(customFields))
        .toEqual(['fields', 'checkboxes']);

      _.chain(_.union(customFields.fields, customFields.checkboxes))
        .forEach(function(customField) {
          expect(React.isValidElement(customField))
            .toBeTruthy();
        });

      expect(customFields.checkboxes.length)
        .toEqual(1);

      expect(customFields.fields.length)
        .toEqual(6);
    });
  });

  describe('SearchField', function() {
    it('should call onSearch when search icon is clicked', function() {
      const searchField = React.render(
        <SearchField onSearchIconClick={onSearch} />,
        global.document.body
      );
      const searchFieldNode = searchField.getDOMNode();

      ReactTestUtils.Simulate.click(searchFieldNode.querySelector('.Icon--search'));

      expect(onSearch)
        .toHaveBeenCalled();
    });

    it('should clear input and call props.onChangeValue when clear icon is clicked', function() {
      const searchField = React.render(
        <SearchField onChangeValue={onChangeValue} />,
        global.document.body
      );
      const searchFieldNode = searchField.getDOMNode();
      const searchInputNode = searchFieldNode.querySelector('input');

      searchInputNode.value = 'Search string';

      ReactTestUtils.Simulate.click(searchFieldNode.querySelector('.Icon--clearInput'));

      expect(searchInputNode.value)
        .toEqual('');

      expect(onChangeValue)
        .toHaveBeenCalledWith('');
    });
  });

  describe('SearchFieldButton', function() {
    it('should call onClick when searchField is clicked', function() {
      const searchFieldButton = React.render(
        <SearchFieldButton onClick={onClick} />,
        global.document.body
      );

      const searchFieldButtonNode = searchFieldButton.getDOMNode();

      ReactTestUtils.Simulate.click(
        searchFieldButtonNode.querySelector('.Form-field--search'));

      expect(onClick)
        .toHaveBeenCalled();
    });
  });
});
