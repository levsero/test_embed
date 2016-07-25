describe('FormField component', function() {
  let Field,
    getCustomFields,
    mockIsLandscapeValue,
    mockIsMobileBrowserValue;
  const formFieldPath = buildSrcPath('component/FormField');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockIsMobileBrowserValue = false;
    mockIsLandscapeValue = false;

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: React.createClass({
          render: function() {
            return (
              <span>
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
        isIos: noop,
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
});
