describe('fields', () => {
  let getCustomFields,
    mockLocaleIdValue;

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
    required_in_portal: false,
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
    editable_in_portal: true
  };
  const decimalFieldPayload = {
    id: '22823260',
    type: 'decimal',
    title_in_portal: 'Total Cost',
    required_in_portal: false,
    visible_in_portal: true,
    editable_in_portal: true
  };
  const checkboxFieldPayload = {
    id: '22823270',
    type: 'checkbox',
    title_in_portal: 'Can we call you?',
    required_in_portal: false,
    visible_in_portal: true,
    editable_in_portal: true
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
    editable_in_portal: true
  };
  /* eslint-enable camelcase */

  beforeEach(() => {
    resetDOM();

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
      'component/field/Dropdown': {
        Dropdown: noopReactComponent()
      },
      'component/field/Checkbox': {
        Checkbox: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          getLocaleId: () => mockLocaleIdValue
        }
      },
      'utility/devices': {
        isMobileBrowser: noop,
        isLandscape: noop
      },
      'utility/globals': {
        document: document
      }
    });

    mockery.registerAllowable(fieldsPath);

    getCustomFields = requireUncached(fieldsPath).getCustomFields;
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
        expect(customFields.allFields[0].props.placeholder)
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

    describe('when a fields visible and edtiable properties are undefined', () => {
      beforeEach(() => {
        subjectFieldPayload.visible_in_portal = undefined;
        subjectFieldPayload.editable_in_portal = undefined;

        payload = [subjectFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('should return the field', () => {
        expect(customFields.allFields[0].props.placeholder)
          .toBe('What is your query about?');
      });
    });
    /* eslint-enable camelcase */

    describe('props', () => {
      it('should pass through the id to name', () => {
        expect(customFields.allFields[0].props.name)
          .toEqual('22660514');

        expect(customFields.allFields[1].props.name)
          .toEqual(10006);
      });

      describe('required', () => {
        beforeEach(() => {
          payload = [textFieldPayload, descriptionFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should respect the required prop', () => {
          expect(customFields.allFields[0].props.required)
            .toEqual(true);
        });

        it('should respect the `required_in_portal` setting over the `required` one', () => {
          expect(customFields.allFields[1].props.required)
            .toEqual(false);
        });
      });

      describe('title', () => {
        beforeEach(() => {
          payload = [textareaFieldPayload, descriptionFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass through the title', () => {
          expect(customFields.allFields[0].props.placeholder)
            .toEqual('Order Details');
        });

        it('should pass through the `title_in_portal` instead of `title` if it exists', () => {
          expect(customFields.allFields[1].props.placeholder)
            .toEqual('How can we help?');
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
      });

      describe('integer field', () => {
        beforeEach(() => {
          payload = [integerFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass in a pattern', () => {
          expect(customFields.allFields[0].props.pattern)
            .toBeTruthy();
        });

        it('should be type number', () => {
          expect(customFields.allFields[0].props.type)
            .toEqual('number');
        });
      });

      describe('decimal field', () => {
        beforeEach(() => {
          payload = [decimalFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass in a pattern', () => {
          expect(customFields.allFields[0].props.pattern)
            .toBeTruthy();
        });

        it('should be type number', () => {
          expect(customFields.allFields[0].props.type)
            .toEqual('number');
        });

        it('should assign a step', () => {
          expect(customFields.allFields[0].props.step)
            .toEqual('any');
        });
      });

      describe('checkbox field', () => {
        let checkboxField;

        describe('when clearCheckboxes option is false', () => {
          beforeEach(() => {
            payload = [checkboxFieldPayload];
            customFields = getCustomFields(payload, {});
            checkboxField = customFields.allFields[0];
          });

          it('should assign a type of checkbox', () => {
            expect(checkboxField.props.type)
              .toEqual('checkbox');
          });

          it('should pass through a label', () => {
            expect(checkboxField.props.label)
              .toEqual('Can we call you?');
          });

          it('should pass through the uncheck prop as false', () => {
            expect(checkboxField.props.uncheck)
              .toBe(false);
          });
        });

        describe('when clearCheckboxes option is true', () => {
          beforeEach(() => {
            payload = [checkboxFieldPayload];
            customFields = getCustomFields(payload, { clearCheckboxes: true });
            checkboxField = customFields.allFields[0];
          });

          it('should assign a type of checkbox', () => {
            expect(checkboxField.props.type)
              .toEqual('checkbox');
          });

          it('should pass through a label', () => {
            expect(checkboxField.props.label)
              .toEqual('Can we call you?');
          });

          it('should pass through the uncheck prop as true', () => {
            expect(checkboxField.props.uncheck)
              .toBe(true);
          });
        });
      });
    });
  });
});
