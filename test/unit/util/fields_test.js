describe('fields', () => {
  let getCustomFields,
    mockLocaleIdValue;

  const fieldsPath = buildSrcPath('util/fields');
  const textFieldPayload = {
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
  };
  const nestedDropdownFieldPayload = {
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
  };
  const variantDropdownFieldPayload = {
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
        name: 'Sales',
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
        name: 'Support',
        value: 2
      }
    ],
    required: true
  };
  const textareaFieldPayload = {
    id: '22660524',
    type: 'textarea',
    title: 'Order Details',
    required: true
  };
  const integerFieldPayload = {
    id: '22823250',
    type: 'integer',
    title: 'Age',
    required: true
  };
  const decimalFieldPayload = {
    id: '22823260',
    type: 'decimal',
    title: 'Total Cost',
    required: false
  };
  const checkboxFieldPayload = {
    id: '22823270',
    type: 'checkbox',
    title: 'Can we call you?',
    required: false
  };
  /* eslint-disable camelcase */
  const descriptionFieldPayload = {
    id: '2284527',
    type: 'description',
    title: 'description',
    title_in_portal: 'How can we help?',
    required: true,
    required_in_portal: false
  };
  const subjectFieldPayload = {
    id: '2284528',
    type: 'subject',
    title: 'subject',
    title_in_portal: 'What is your query about?',
    required: true,
    required_in_portal: true
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
        Field: NoopReactComponent()
      },
      'component/field/SelectField': {
        SelectField: NoopReactComponent()
      },
      'service/i18n': {
        i18n: {
          getLocaleId: () => mockLocaleIdValue
        }
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
        variantDropdownFieldPayload,
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

        describe('with variants', () => {
          beforeEach(() => {
            payload = [textFieldPayload];
            mockLocaleIdValue = 16;
            customFields = getCustomFields(payload, {});
          });

          it('should use the correct value for the current localeId', () => {
            expect(customFields.allFields[0].props.placeholder)
              .toEqual('FrenchField');
          });
        });
      });

      describe('tagger field', () => {
        beforeEach(() => {
          payload = [nestedDropdownFieldPayload, variantDropdownFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should pass through options', () => {
          expect(customFields.allFields[0].props.options)
            .toEqual(nestedDropdownFieldPayload.options);
        });

        it('should change name to title if it has that format', () => {
          expect(customFields.allFields[1].props.options[0].title)
            .toBeTruthy();
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
        beforeEach(() => {
          payload = [checkboxFieldPayload];
          customFields = getCustomFields(payload, {});
        });

        it('should assign a type of checkbox', () => {
          expect(customFields.allFields[0].props.type)
            .toEqual('checkbox');
        });

        it('should pass through a label', () => {
          expect(customFields.allFields[0].props.label)
            .toEqual('Can we call you?');
        });
      });
    });
  });
});
