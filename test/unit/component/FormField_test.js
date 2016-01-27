describe('FormField component', function() {
  let onChangeValue,
    SearchField,
    SearchFieldButton,
    Field,
    getCustomFields,
    mockIsLandscapeValue,
    mockIsMobileBrowserValue;
  const formFieldPath = buildSrcPath('component/FormField');

  beforeEach(function() {
    onChangeValue = jasmine.createSpy('onChangeValue');

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockIsMobileBrowserValue = false;
    mockIsLandscapeValue = false;

    initMockRegistry({
      'React': React,
      'component/Loading': {
        LoadingEllipses: React.createClass({
          render: function() {
            return (
              <div className={`Loading ${this.props.className}`}>
                <div className='Loading-item'></div>
              </div>
            );
          }
        })
      },
      'component/Icon': {
        Icon: React.createClass({
          render: function() {
            return (
              <span
                className={this.props.className}
                onClick={this.props.onClick}
                type={`${this.props.type}`}>
                <svg />
              </span>
            );
          }
        })
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return mockIsMobileBrowserValue;
        },
        isLandscape: function() {
          return mockIsLandscapeValue;
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
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
      const field = domRender(<Field name='alice' />);
      const fieldNode = ReactDOM.findDOMNode(field);

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
      const field = domRender(<Field type='email' name='alice' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input').name)
        .toEqual('alice');

      expect(fieldNode.querySelector('input').type)
        .toEqual('email');
    });

    it('should render input prop component instead of default input', function() {
      const field = domRender(<Field input={<textarea />} name='alice' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input'))
        .toBeFalsy();

      expect(fieldNode.querySelector('textarea'))
        .toBeTruthy();

      expect(fieldNode.querySelector('textarea').name)
        .toEqual('alice');
    });

    it('should render checkbox with label instead of default input', function() {
      const field = domRender(<Field label='Agree?' type='checkbox' name='alice' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input').type)
        .toEqual('checkbox');

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'Form-checkboxCaption'))
        .toBeTruthy();
    });

    it('should set focused state on field focus', function() {
      const field = domRender(<Field name='alice' />);

      expect(field.state.focused)
        .toBe(false);

      field.onFocus();

      expect(field.state.focused)
        .toBe(true);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--focused'))
        .toBeTruthy();
    });

    it('should only set invalid class after focus and blur events', function() {
      const field = domRender(<Field name='alice' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      // jsdom doesn't seem to support html5 validation api
      // shim it for this test
      fieldNode.querySelector('input').validity = {
        valid: false
      };

      expect(field.state.hasError)
        .toBe(false);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--invalid'))
        .toThrow();

      field.onFocus();
      field.onBlur();

      expect(field.state.hasError)
        .toBe(true);

      expect(field.state.focused)
        .toBe(false);

      expect(field.state.blurred)
        .toBe(true);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--invalid'))
        .toBeTruthy();
    });
  });

  describe('mobile', function() {
    it('should have default mobile classes when isMobileBrowser is true', function() {
      mockIsMobileBrowserValue = true;

      const field = domRender(<Field />);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSize15'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSizeSml'))
        .toThrow();
    });

    it('should have extra landscape classes when isLandscape is true', function() {
      mockIsMobileBrowserValue = true;
      mockIsLandscapeValue = true;

      const field = domRender(<Field />);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSizeSml'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSize15'))
        .toThrow();
    });

    it('should not have mobile classes when isMobileBrowser is false', function() {
      const field = domRender(<Field />);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSize15'))
        .toThrow();
    });
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
    it('should clear input and call props.onChangeValue when clear icon is clicked', function() {
      const searchField = domRender(<SearchField onChangeValue={onChangeValue} />);
      const searchFieldNode = ReactDOM.findDOMNode(searchField);
      const searchInputNode = searchFieldNode.querySelector('input');

      searchInputNode.value = 'Search string';

      TestUtils.Simulate.click(searchFieldNode.querySelector('.Icon--clearInput'));

      expect(searchInputNode.value)
        .toEqual('');

      expect(onChangeValue)
        .toHaveBeenCalledWith('');
    });

    it('should display `Loading` component when `this.props.isLoading` is truthy', function() {
      const searchField = domRender(<SearchField isLoading={true} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Loading');

      expect(searchField.props.isLoading)
        .toEqual(true);

      expect(loadingNode.props.className)
        .not.toMatch('u-isHidden');
    });

    it('should not display `Loading` component when `this.props.isLoading` is falsy', function() {
      const searchField = domRender(<SearchField isLoading={false} />);
      const loadingNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Loading');

      expect(searchField.props.isLoading)
        .toEqual(false);

      expect(loadingNode.props.className)
        .toMatch('u-isHidden');
    });

    it('should display `clearInput` Icon when the input has text and `this.props.isLoading` is false', function() {
      mockIsMobileBrowserValue = true;

      const searchField = domRender(<SearchField isLoading={false} />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: 'something' });

      expect(searchField.state.searchInputVal)
        .toEqual('something');

      expect(clearInputNode.props.className)
        .not.toMatch('u-isHidden');
    });

    it('should not display `clearInput` Icon when the input has no text', function() {
      const searchField = domRender(<SearchField />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: '' });

      expect(searchField.state.searchInputVal)
        .toEqual('');

      expect(clearInputNode.props.className)
        .toMatch('u-isHidden');
    });

    it('should not display `clearInput` Icon when `this.props.isLoading` is true', function() {
      const searchField = domRender(<SearchField isLoading={true} />);
      const clearInputNode = TestUtils.findRenderedDOMComponentWithClass(searchField, 'Icon--clearInput');

      searchField.setState({ searchInputVal: 'something' });

      expect(searchField.state.searchInputVal)
        .toEqual('something');

      expect(clearInputNode.props.className)
        .toMatch('u-isHidden');
    });
  });

  describe('SearchFieldButton', function() {
    it('should have a onClick function its div', function() {
      const onClick = jasmine.createSpy();
      const searchFieldButton = domRender(<SearchFieldButton onClick={onClick} />);

      const searchFieldButtonNode = ReactDOM.findDOMNode(searchFieldButton);

      TestUtils.Simulate.click(
        searchFieldButtonNode.querySelector('.Form-field--search'));

      expect(onClick)
        .toHaveBeenCalled();
    });
  });
});
