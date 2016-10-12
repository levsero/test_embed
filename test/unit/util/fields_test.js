describe('fields', () => {
  let getCustomFields;
  const fieldsPath = buildSrcPath('util/fields');

  beforeEach(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      'component/field/Field': {
        Field: noopReactComponent()
      },
      'component/field/SelectField': {
        SelectField: noopReactComponent()
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [ 'getLocaleId' ])
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
    let customFields;
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

    beforeEach(() => {
      customFields = getCustomFields(payload, {});
    });

    it('should convert custom field payload into array of React components', () => {
      _.chain(_.union(customFields.fields, customFields.checkboxes))
        .forEach(function(customField) {
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
        .toEqual(6);

      expect(customFields.allFields.length)
        .toEqual(7);
    });
  });
});
