describe('fields', () => {
  let getCustomFields,
    shouldRenderErrorMessage,
    renderLabelText,
    mockLocaleIdValue;

  const translateSpy = jasmine.createSpy('t').and.callFake(_.identity);
  const fieldsPath = buildSrcPath('util/fields');
  /* eslint-disable camelcase */
  const textFieldPayload = {
    id: '22660514',
    type: 'text',
    title_in_portal: 'Text',
    required_in_portal: true,
    visible_in_portal: true,
    editable_in_portal: true
  };
  const nestedDropdownFieldPayload = {
    id: 10006,
    type: 'tagger',
    title_in_portal: 'Nested Drop Down',
    required_in_portal: true,
    custom_field_options: [
      {
        name: 'Option1::Part1',
        value: 'option1__part1'
      },
      {
        name: 'Option2::Part2',
        value: 'option2__part2'
      },
      {
        name: 'Option1::Part2',
        value: 'option1__part2'
      }
    ],
    visible_in_portal: true,
    editable_in_portal: true
  };
  const dropdownFieldPayload = {
    id: '22666574',
    type: 'tagger',
    title_in_portal: 'Department',
    custom_field_options: [
      {
        name: 'Sales',
        value: 1
      },
      {
        name: 'Support',
        value: 2
      }
    ],
    visible_in_portal: true,
    editable_in_portal: true,
    required_in_portal: true
  };
  const textareaFieldPayload = {
    id: '22660524',
    type: 'textarea',
    title_in_portal: 'Order Details',
    required_in_portal: true,
    visible_in_portal: true,
    editable_in_portal: true
  };
  const integerFieldPayload = {
    id: '22823250',
    type: 'integer',
    title_in_portal: 'Age',
    required_in_portal: true,
    visible_in_portal: true,
    editable_in_portal: true,
    description: 'this is the integer description'
  };
  const decimalFieldPayload = {
    id: '22823260',
    type: 'decimal',
    title_in_portal: 'Total Cost',
    required_in_portal: true,
    visible_in_portal: true,
    editable_in_portal: true,
    description: 'this is the decimal description'
  };
  const checkboxFieldPayload = {
    id: '22823270',
    type: 'checkbox',
    title_in_portal: 'Can we call you?',
    required_in_portal: true,
    visible_in_portal: true,
    editable_in_portal: true,
    description: 'this is the description'
  };
  const descriptionFieldPayload = {
    id: '2284527',
    type: 'description',
    title_in_portal: 'How can we help?',
    required_in_portal: false,
    visible_in_portal: true,
    editable_in_portal: true
  };
  const subjectFieldPayload = {
    id: '2284528',
    type: 'subject',
    title_in_portal: 'What is your query about?',
    required_in_portal: true,
    visible_in_portal: true,
    editable_in_portal: true,
    description: 'subject description'
  };

  const constantsPath = buildSrcPath('constants/shared');
  let sharedConstants = requireUncached(constantsPath);
  let EMAIL_PATTERN = sharedConstants.EMAIL_PATTERN;
  /* eslint-enable camelcase */

  const Message = noopReactComponent();
  const Checkbox = noopReactComponent();

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false
    });

    mockLocaleIdValue = 1;

    initMockRegistry({
      'React': React,
      'component/field/Field': {
        Field: noopReactComponent()
      },
      'component/field/SelectField': {
        SelectField: noopReactComponent()
      },
      '@zendeskgarden/react-textfields': {
        TextField: noopReactComponent(),
        Textarea: noopReactComponent(),
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Message
      },
      '@zendeskgarden/react-checkboxes': {
        Checkbox,
        Label: noopReactComponent(),
        Hint: noopReactComponent(),
        Message
      },
      'component/field/NestedDropdown': {
        NestedDropdown: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          getLocaleId: () => mockLocaleIdValue,
          t: translateSpy
        }
      },
      'utility/devices': {
        isMobileBrowser: noop,
        isLandscape: noop
      },
      './fields.scss': {
        locals: {}
      }
    });

    mockery.registerAllowable(fieldsPath);

    let fields = requireUncached(fieldsPath);

    getCustomFields = fields.getCustomFields;
    shouldRenderErrorMessage = fields.shouldRenderErrorMessage;
    renderLabelText = fields.renderLabelText;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getCustomFields', () => {
    let customFields,
      payload;

    beforeEach(() => {
      payload = [
        textFieldPayload,
        nestedDropdownFieldPayload,
        dropdownFieldPayload,
        textareaFieldPayload,
        integerFieldPayload,
        decimalFieldPayload,
        checkboxFieldPayload,
        descriptionFieldPayload,
        subjectFieldPayload
      ];
      customFields = getCustomFields(payload, {});
    });

    it('should convert custom field payload into array of React components', () => {
      _.forEach(customFields.allFields, (customField) => {
        expect(React.isValidElement(customField))
          .toBeTruthy();
      });
    });

    it('should return an object with allFields, checkboxes and fields', () => {
      expect(Object.keys(customFields))
        .toEqual(['fields', 'checkboxes', 'allFields']);
    });

    it('should return the correct number of components in each key', () => {
      expect(customFields.checkboxes.length)
        .toEqual(1);

      expect(customFields.fields.length)
        .toEqual(8);

      expect(customFields.allFields.length)
        .toEqual(9);
    });

    /* eslint-disable camelcase */
    describe('when a field is both visible and editable', () => {
      beforeEach(() => {
        subjectFieldPayload.visible_in_portal = true;
        subjectFieldPayload.editable_in_portal = true;

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('should return the field', () => {
        const labelElement = customFields.allFields[0].props.children[0];

        expect(labelElement.props.children)
          .toBe('What is your query about?');
      });
    });

    describe('when a field is visible but not editable', () => {
      beforeEach(() => {
        subjectFieldPayload.visible_in_portal = true;
        subjectFieldPayload.editable_in_portal = false;

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('should not return the field', () => {
        expect(customFields.allFields.length)
          .toBe(0);
      });
    });

    describe('when a field is not both visible and editable', () => {
      beforeEach(() => {
        subjectFieldPayload.visible_in_portal = false;
        subjectFieldPayload.editable_in_portal = false;

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('should not return the field', () => {
        expect(customFields.allFields.length)
          .toBe(0);
      });
    });

    describe('when a fields visible and editable properties are undefined', () => {
      beforeEach(() => {
        subjectFieldPayload.visible_in_portal = undefined;
        subjectFieldPayload.editable_in_portal = undefined;

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('should return the field', () => {
        const labelElement = customFields.allFields[0].props.children[0];

        expect(labelElement.props.children)
          .toBe('What is your query about?');
      });
    });

    describe('when a field is visible and editable properties are undefined', () => {
      beforeEach(() => {
        subjectFieldPayload.visible_in_portal = undefined;
        subjectFieldPayload.editable_in_portal = undefined;

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('should return the field', () => {
        const labelElement = customFields.allFields[0].props.children[0];

        expect(labelElement.props.children)
          .toBe('What is your query about?');
      });
    });

    describe('when a description is supplied', () => {
      beforeEach(() => {
        subjectFieldPayload.description = 'this is the description';

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('renders the description', () => {
        const descriptionElement = customFields.allFields[0].props.children[1];

        expect(descriptionElement.props.children)
          .toBe('this is the description');
      });
    });
    /* eslint-enable camelcase */

    describe('props', () => {
      it('should pass through the id to name', () => {
        const field1 = customFields.allFields[0].props.children[2];
        const field2 = customFields.allFields[1];

        expect(field1.props.name)
          .toEqual('22660514');

        expect(field2.props.name)
          .toEqual(10006);
      });

      describe('required', () => {
        beforeEach(() => {
          payload = [textFieldPayload, descriptionFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should respect the required prop', () => {
          const inputElement = customFields.allFields[0].props.children[2];

          expect(inputElement.props.required)
            .toEqual(true);
        });

        it('should respect the `required_in_portal` setting over the `required` one', () => {
          const inputElement = customFields.allFields[1].props.children[2];

          expect(inputElement.props.required)
            .toEqual(false);
        });
      });

      describe('title', () => {
        beforeEach(() => {
          payload = [textareaFieldPayload, subjectFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass through the title', () => {
          const labelElement = customFields.allFields[0].props.children[0];

          expect(labelElement.props.children)
            .toEqual('Order Details');
        });

        it('should pass through the `title_in_portal` instead of `title` if it exists', () => {
          const labelElement = customFields.allFields[1].props.children[0];

          expect(labelElement.props.children)
            .toEqual('What is your query about?');
        });
      });

      describe('tagger field', () => {
        beforeEach(() => {
          payload = [nestedDropdownFieldPayload, dropdownFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass through options', () => {
          expect(customFields.allFields[0].props.options)
            .toEqual(nestedDropdownFieldPayload.custom_field_options);
        });

        it('sets showError to a falsy value by default', () => {
          expect(customFields.allFields[0].props.showErrors)
            .toBeFalsy();
        });

        describe('when there are errors', () => {
          beforeEach(() => {
            payload = [nestedDropdownFieldPayload];
            customFields = getCustomFields(payload, {}, { showErrors: true });
          });

          it('sets showError to true', () => {
            expect(customFields.allFields[0].props.showErrors)
              .toEqual(true);
          });
        });
      });

      describe('integer field', () => {
        beforeEach(() => {
          payload = [integerFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass in a pattern', () => {
          const inputElement = customFields.allFields[0].props.children[2];

          expect(inputElement.props.pattern)
            .toBeTruthy();
        });

        it('should be type number', () => {
          const inputElement = customFields.allFields[0].props.children[2];

          expect(inputElement.props.type)
            .toEqual('number');
        });

        it('has a description', () => {
          const descriptionElement = customFields.allFields[0].props.children[1];

          expect(descriptionElement.props.children)
            .toEqual('this is the integer description');
        });

        it('does not have a Message component', () => {
          expect(TestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
            .toEqual(false);
        });

        describe('when there are errors', () => {
          beforeEach(() => {
            payload = [integerFieldPayload];
            customFields = getCustomFields(payload, {}, { showErrors: true });
          });

          it('has a Message component', () => {
            expect(TestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
              .toEqual(true);
          });
        });
      });

      describe('decimal field', () => {
        beforeEach(() => {
          payload = [decimalFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass in a pattern', () => {
          const inputElement = customFields.allFields[0].props.children[2];

          expect(inputElement.props.pattern)
            .toBeTruthy();
        });

        it('should be type number', () => {
          const inputElement = customFields.allFields[0].props.children[2];

          expect(inputElement.props.type)
            .toEqual('number');
        });

        it('should assign a step', () => {
          const inputElement = customFields.allFields[0].props.children[2];

          expect(inputElement.props.step)
            .toEqual('any');
        });

        it('has a description', () => {
          const descriptionElement = customFields.allFields[0].props.children[1];

          expect(descriptionElement.props.children)
            .toEqual('this is the decimal description');
        });

        it('does not have a Message component', () => {
          expect(TestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
            .toEqual(false);
        });

        describe('when there are errors', () => {
          beforeEach(() => {
            payload = [decimalFieldPayload];
            customFields = getCustomFields(payload, {}, { showErrors: true });
          });

          it('has a Message component', () => {
            expect(TestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
              .toEqual(true);
          });
        });
      });

      describe('checkbox field', () => {
        let checkboxField;

        beforeEach(() => {
          payload = [checkboxFieldPayload];
          customFields = getCustomFields(payload, {});

          checkboxField = customFields.allFields[0];
        });

        it('returns a Checkbox element', () => {
          expect(checkboxField.type)
            .toEqual(Checkbox);
        });

        it('has a label', () => {
          const label = checkboxField.props.children[0];

          expect(label.props.children)
            .toEqual('Can we call you?');
        });

        it('has a description', () => {
          const message = checkboxField.props.children[1];

          expect(message.props.children)
            .toEqual('this is the description');
        });

        it('has no error', () => {
          const message = checkboxField.props.children[1];

          expect(message.props.children)
            .toEqual('this is the description');
        });

        it('does not have a Message component', () => {
          expect(TestUtils.isElementOfType(checkboxField.props.children[2], Message))
            .toEqual(false);
        });

        describe('when there are errors', () => {
          beforeEach(() => {
            payload = [checkboxFieldPayload];
            customFields = getCustomFields(payload, {}, { showErrors: true });

            checkboxField = customFields.allFields[0];
          });

          it('has a Message component', () => {
            expect(TestUtils.isElementOfType(checkboxField.props.children[2], Message))
              .toEqual(true);
          });
        });
      });
    });
  });

  describe('shouldRenderErrorMessage', () => {
    let result,
      mockValue,
      mockRequired,
      mockShowErrors,
      mockPattern;

    beforeEach(() => {
      result = shouldRenderErrorMessage(mockValue, mockRequired, mockShowErrors, mockPattern);
    });

    describe('showErrors', () => {
      beforeAll(() => {
        mockRequired = true;
        mockPattern = false;
        mockValue = null;
      });

      describe('when we should show errors', () => {
        beforeAll(() => {
          mockShowErrors = true;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when we should not show errors', () => {
        beforeAll(() => {
          mockShowErrors = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('isValid', () => {
      beforeAll(() => {
        mockShowErrors = true;
      });

      describe('when field is invalid', () => {
        describe('when field is required but no value provided', () => {
          beforeAll(() => {
            mockRequired = true;
            mockValue = null;
            mockPattern = null;
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });

        describe('field does not pass pattern test', () => {
          beforeAll(() => {
            mockRequired = false;
            mockValue = 'taipan@@@@@@@@@zendesk.com';
            mockPattern = EMAIL_PATTERN;
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });
      });

      describe('when field is valid', () => {
        describe('when field has an existing value', () => {
          beforeAll(() => {
            mockRequired = true;
            mockValue = 'taipan@zendesk.com';
            mockPattern = EMAIL_PATTERN;
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });

        describe('when field has no value', () => {
          beforeAll(() => {
            mockRequired = false;
            mockValue = '';
            mockPattern = EMAIL_PATTERN;
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });
      });
    });
  });

  describe('renderLabelText', () => {
    let result,
      mockLabel,
      mockRequired;

    beforeEach(() => {
      result = renderLabelText(mockLabel, mockRequired);
    });

    describe('when field is required', () => {
      beforeAll(() => {
        mockLabel = 'yolo';
        mockRequired = true;
      });

      it('returns just the label', () => {
        expect(result)
          .toEqual('yolo');
      });
    });

    describe('when label is falsy', () => {
      beforeAll(() => {
        mockLabel = null;
        mockRequired = false;
      });

      it('returns the original value', () => {
        expect(result)
          .toEqual(null);
      });
    });

    describe('when field is not required', () => {
      beforeAll(() => {
        mockLabel = 'yolo';
        mockRequired = false;
      });

      it('calls i18n translate to include "optional" key', () => {
        expect(translateSpy)
          .toHaveBeenCalledWith('embeddable_framework.validation.label.optional', { label: 'yolo' });
      });
    });
  });
});
