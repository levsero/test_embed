describe('formatter submitTicket helper', () => {
  let formatRequestData,
    mockStoreValue,
    mockSettingsValue;

  const formatterPath = buildSrcPath('redux/modules/submitTicket/helpers/formatter');

  beforeEach(() => {
    mockStoreValue = false;
    mockSettingsValue = false;

    mockery.enable();

    initMockRegistry({
      'service/i18n': {
        i18n: {
          t: _.identity,
          getLocaleId: () => 'fr'
        }
      },
      'service/settings': {
        settings: {
          get: () => mockSettingsValue
        }
      },
      'service/persistence': {
        store: {
          get: () => mockStoreValue
        }
      },
      'utility/globals': {
        location: global.window.location
      }
    });

    mockery.registerAllowable(formatterPath);

    formatRequestData = requireUncached(formatterPath).formatRequestData;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('formatRequestData', () => {
    let params, mockValues;
    const formParams = {
      'name': 'bob',
      'email': 'mock@email.com',
      'description': 'Mock Description',
      'subject': 'Mock Subject',
      'set_tags': 'web_widget',
      'via_id': 48,
      'locale_id': 'fr',
      'submitted_from': global.window.location.href
    };

    beforeEach(() => {
      mockValues = {
        email: formParams.email,
        description: formParams.description,
        name: formParams.name,
        subject: formParams.subject
      };

      params = formatRequestData(mockValues);
    });

    it('wraps the data in a request object', () => {
      expect(params.request)
        .toBeTruthy();
    });

    it('formats the requester correctly', () => {
      expect(params.request.requester)
        .toEqual(jasmine.objectContaining({
          'name': formParams.name,
          'email': formParams.email,
          'locale_id': formParams.locale_id
        }));
    });

    it('Adds the correct tag', () => {
      expect(params.request.tags)
        .toContain('web_widget');
    });

    it('adds any extra tags', () => {
      mockSettingsValue = 'extra_tag';
      params = formatRequestData(mockValues);

      expect(params.request.tags)
        .toContain('extra_tag');
    });

    it('Adds the correct via_id', () => {
      /* eslint camelcase:0 */
      expect(params.request.via_id)
        .toEqual(48);
    });

    describe('when name field is empty', () => {
      const values = [
        {
          email: 'harry.j.potter@hogwarts.com',
          expected: 'Harry J Potter'
        },
        {
          email: 'ron_b.weasley@hogwarts.com',
          expected: 'Ron B Weasley'
        },
        {
          email: 'hermione_granger@hogwarts.com',
          expected: 'Hermione Granger'
        },
        {
          email: 'dracomalfoy@hogwarts.com',
          expected: 'Dracomalfoy'
        },
        {
          email: 'ginny-weasley@hogwarts.com',
          expected: 'Ginny Weasley'
        }
      ];

      const assertEmailFormat = (email, expected) => {
        it(`formats the name correct based on the email ${email}`, () => {
          mockValues.name = '';
          mockValues.email = email;
          params = formatRequestData(mockValues);

          expect(params.request.requester.name)
            .toEqual(expected);
        });
      };

      _.forEach(values, (value) => {
        assertEmailFormat(value.email, value.expected);
      });
    });

    it('uses the description as the subject', () => {
      expect(params.request.subject)
        .toEqual(formParams.description);
    });

    it('trims the subject if it is too long', () => {
      mockValues.description = 'this text is longer then 50 characters xxxxxxxxxxxx';
      params = formatRequestData(mockValues);

      expect(params.request.subject)
        .toEqual('this text is longer then 50 characters xxxxxxxxxxx...');
    });

    describe('when stores referrerPolicy is false', () => {
      it('adds submitted from to the description', () => {
        const label = 'embeddable_framework.submitTicket.form.submittedFrom.label';

        expect(params.request.comment.body)
          .toBe(`${formParams.description}\n\n------------------\n${label}`);
      });
    });

    describe('when stores referrerPolicy is true', () => {
      it('adds submitted from to the description', () => {
        mockStoreValue = true;

        params = formatRequestData(mockValues);

        expect(params.request.comment.body)
          .toBe(formParams.description);
      });
    });

    describe('when the form has custom ticket fields', () => {
      beforeEach(() => {
        const mockCustomField = [
          {
            id: '22660514',
            type: 'text',
            title: 'Text'
          }
        ];

        mockValues['22660514'] = 'mockCustomField';

        params = formatRequestData(mockValues, false, mockCustomField);
      });

      it('should correctly format custom fields', () => {
        expect(params.request.fields['22660514'])
          .toBe('mockCustomField');
      });
    });

    describe('when the form is a user ticket form', () => {
      let mockTicketForm,
        ticketFields;

      beforeEach(() => {
        ticketFields = [
          {
            id: 1,
            type: 'description',
            removable: false
          },
          {
            id: 4,
            type: 'text',
            removable: true
          }
        ];
        mockTicketForm = {
          id: 50,
          ticket_field_ids: [ 1, 2, 4 ]
        };

        mockValues = {
          email: formParams.email,
          name: formParams.name,
          1: 'Just saying Hi',
          2: 'Hello',
          4: 'Cheeseburger'
        };

        params = formatRequestData(mockValues, true, ticketFields, mockTicketForm);
      });

      it('should correctly format custom fields', () => {
        expect(params.request.fields[4])
          .toBe('Cheeseburger');
      });

      describe('when subject field is not available', () => {
        it('uses the description as the subject', () => {
          expect(params.request.subject)
            .toBe('Just saying Hi');
        });
      });

      describe('when the subject field is available', () => {
        beforeEach(() => {
          ticketFields.push({ id: 2, type: 'subject', removable: false });

          params = formatRequestData(mockValues, true, ticketFields, mockTicketForm);
        });

        it('should correctly format the subject field', () => {
          expect(params.request.fields[2])
            .not.toBe('Hello');

          expect(params.request.subject)
            .toBe('Hello');
        });
      });

      it('should correctly format the description field', () => {
        expect(params.request.fields[1])
          .not.toBe('Just saying Hi');

        expect(params.request.comment.body)
          .toContain('Just saying Hi');
      });

      it('should send through the ticket_form_id', () => {
        expect(params.request.ticket_form_id)
          .toBe(50);
      });
    });
  });
});
