import _ from 'lodash';
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import 'utility/i18nTestHelper';
import {
  getStyledLabelText,
  shouldRenderErrorMessage,
  renderLabel,
  getDefaultFieldValues,
  getCustomFields
} from '../fields';
import { EMAIL_PATTERN } from 'constants/shared';
import { Message } from '@zendeskgarden/react-textfields';
import { noopReactComponent } from 'utility/testHelpers';
import { Checkbox, Message as CheckboxMessage } from '@zendeskgarden/react-checkboxes';

describe('getStyledLabelText', () => {
  const label = 'What Biltong flavour would you like to order?';

  describe('when label is empty', () => {
    it('returns null', () => {
      const result = getStyledLabelText('', false);

      expect(result)
        .toBeNull();
    });
  });

  describe('when label contains text', () => {
    describe('when it is required', () => {
      it('returns a stringified result', () => {
        const expected = `<strong>${label}</strong>`;
        const result = getStyledLabelText(label, true);

        expect(result)
          .toEqual(expected);
      });
    });

    describe('when it is not required', () => {
      it('appends optional to the label', () => {
        const result = getStyledLabelText(label, false);

        expect(result)
          .toEqual(`<strong>${label}</strong> (optional)`);
      });
    });
  });
});

describe('shouldRenderErrorMessage', () => {
  describe('when we should show errors', () => {
    it('returns true', () => {
      const result = shouldRenderErrorMessage(null, true, true, false);

      expect(result)
        .toEqual(true);
    });
  });

  describe('when we should not show errors', () => {
    it('returns false', () => {
      const result = shouldRenderErrorMessage(null, true, false, false);

      expect(result)
        .toEqual(false);
    });
  });

  describe('isValid', () => {
    describe('when field is invalid', () => {
      describe('when field is required but no value provided', () => {
        it('returns true', () => {
          const result = shouldRenderErrorMessage(null, true, true, null);

          expect(result)
            .toEqual(true);
        });
      });

      describe('field does not pass pattern test', () => {
        it('returns true', () => {
          const result = shouldRenderErrorMessage(
            'taipan@@@@@@@@@zendesk.com',
            false, true, EMAIL_PATTERN);

          expect(result)
            .toEqual(true);
        });
      });
    });

    describe('when field is valid', () => {
      describe('when field has an existing value', () => {
        it('returns false', () => {
          const result = shouldRenderErrorMessage(
            'taipan@zendesk.com',
            true, true, EMAIL_PATTERN);

          expect(result)
            .toEqual(false);
        });
      });

      describe('when field has no value', () => {
        it('returns false', () => {
          const result = shouldRenderErrorMessage(
            '', false, true, EMAIL_PATTERN);

          expect(result)
            .toEqual(false);
        });
      });
    });
  });
});

describe('renderLabel', () => {
  const callRenderLabel = (mockLabel, mockRequired) => {
    const element = renderLabel(noopReactComponent, mockLabel, mockRequired);
    const textContent = element.props.dangerouslySetInnerHTML.__html;

    return textContent;
  };

  describe('when field is required', () => {
    it('returns just the label', () => {
      const result = callRenderLabel('yolo', true);

      expect(result)
        .toContain('<strong>yolo</strong>');
    });
  });

  describe('when label is falsy', () => {
    it('returns the original value', () => {
      const result = callRenderLabel(null, false);

      expect(result)
        .toEqual(null);
    });
  });

  describe('when field is not required', () => {
    it('includes "optional" label', () => {
      const result = callRenderLabel('yolo', false);

      expect(result)
        .toEqual('<strong>yolo</strong> (optional)');
    });
  });
});

describe('getDefaultFieldValues', () => {
  describe('with values', () => {
    test.each([
      ['text',        'a',     { value: 'a' }],
      ['subject',     'b',     { value: 'b' }],
      ['integer',     1,       { value: 1 }],
      ['decimal',     1.1,     { value: 1.1 }],
      ['textarea',    'a\tb',  { value: 'a\tb' }],
      ['description', 'blah',  { value: 'blah' }],
      ['checkbox',    true,    { checked: true }],
      ['tagger',      'bob',   { value: 'bob' }]
    ])('getDefaultFieldValues(%s,%s)',
      (type, value, expected) => {
        expect(getDefaultFieldValues(type, value))
          .toEqual(expected);
      },
    );
  });

  describe('without values', () => {
    test.each([
      ['text',        { value: '' }],
      ['subject',     { value: '' }],
      ['integer',     { value: '' }],
      ['decimal',     { value: '' }],
      ['textarea',    { value: '' }],
      ['description', { value: '' }],
      ['checkbox',    { checked: false }],
      ['tagger',      { value: undefined }]
    ])('getDefaultFieldValues(%s)',
      (type, expected) => {
        expect(getDefaultFieldValues(type))
          .toEqual(expected);
      },
    );
  });
});

describe('getCustomFields', () => {
  let customFields,
    payload;

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

  it('converts custom field payload into array of React components', () => {
    _.forEach(customFields.allFields, (customField) => {
      expect(React.isValidElement(customField))
        .toBeTruthy();
    });
  });

  it('returns an object with allFields, checkboxes and fields', () => {
    expect(Object.keys(customFields))
      .toEqual(['fields', 'checkboxes', 'allFields']);
  });

  it('returns the correct number of components in each key', () => {
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

    it('returns the field', () => {
      const labelElement = customFields.allFields[0].props.children[0];
      const dangerouslySetContent = labelElement.props.dangerouslySetInnerHTML.__html;

      expect(dangerouslySetContent)
        .toContain('<strong>What is your query about?</strong>');
    });
  });

  describe('when a field is visible but not editable', () => {
    beforeEach(() => {
      subjectFieldPayload.visible_in_portal = true;
      subjectFieldPayload.editable_in_portal = false;

      payload = [subjectFieldPayload];
      customFields = getCustomFields(payload, {});
    });

    it('does not return the field', () => {
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

    it('does not return the field', () => {
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

    it('returns the field', () => {
      const labelElement = customFields.allFields[0].props.children[0];
      const dangerouslySetContent = labelElement.props.dangerouslySetInnerHTML.__html;

      expect(dangerouslySetContent)
        .toContain('<strong>What is your query about?</strong>');
    });
  });

  describe('when a field is visible and editable properties are undefined', () => {
    beforeEach(() => {
      subjectFieldPayload.visible_in_portal = undefined;
      subjectFieldPayload.editable_in_portal = undefined;

      payload = [subjectFieldPayload];
      customFields = getCustomFields(payload, {});
    });

    it('returns the field', () => {
      const labelElement = customFields.allFields[0].props.children[0];
      const dangerouslySetContent = labelElement.props.dangerouslySetInnerHTML.__html;

      expect(dangerouslySetContent)
        .toContain('<strong>What is your query about?</strong>');
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
        .toContain('this is the description');
    });
  });
  /* eslint-enable camelcase */

  describe('props', () => {
    it('passes through the id to name', () => {
      const field1 = customFields.allFields[0].props.children[2];
      const field2 = customFields.allFields[1];

      expect(field1.props.name)
        .toEqual('22660514');

      expect(field2.props.name)
        .toEqual('10006');
    });

    describe('required', () => {
      beforeEach(() => {
        payload = [textFieldPayload, descriptionFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('respects the required prop', () => {
        const inputElement = customFields.allFields[0].props.children[2];

        expect(inputElement.props.required)
          .toEqual(true);
      });

      it('respects the `required_in_portal` setting over the `required` one', () => {
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

      it('passes through the title', () => {
        const labelElement = customFields.allFields[0].props.children[0];
        const dangerouslySetContent = labelElement.props.dangerouslySetInnerHTML.__html;

        expect(dangerouslySetContent)
          .toContain('<strong>Order Details</strong>');
      });

      it('passes through the `title_in_portal` instead of `title` if it exists', () => {
        const labelElement = customFields.allFields[1].props.children[0];
        const dangerouslySetContent = labelElement.props.dangerouslySetInnerHTML.__html;

        expect(dangerouslySetContent)
          .toContain('<strong>What is your query about?</strong>');
      });
    });

    describe('tagger field', () => {
      beforeEach(() => {
        payload = [nestedDropdownFieldPayload, dropdownFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('passes through options', () => {
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

      it('passes in a pattern', () => {
        const inputElement = customFields.allFields[0].props.children[2];

        expect(inputElement.props.pattern)
          .toBeTruthy();
      });

      it('is type number', () => {
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
        expect(ReactTestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
          .toEqual(false);
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          payload = [integerFieldPayload];
          customFields = getCustomFields(payload, {}, { showErrors: true });
        });

        it('has a Message component', () => {
          expect(ReactTestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
            .toEqual(true);
        });
      });
    });

    describe('decimal field', () => {
      beforeEach(() => {
        payload = [decimalFieldPayload];
        customFields = getCustomFields(payload, {});
      });

      it('passes in a pattern', () => {
        const inputElement = customFields.allFields[0].props.children[2];

        expect(inputElement.props.pattern)
          .toBeTruthy();
      });

      it('is type number', () => {
        const inputElement = customFields.allFields[0].props.children[2];

        expect(inputElement.props.type)
          .toEqual('number');
      });

      it('assigns a step', () => {
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
        expect(ReactTestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
          .toEqual(false);
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          payload = [decimalFieldPayload];
          customFields = getCustomFields(payload, {}, { showErrors: true });
        });

        it('has a Message component', () => {
          expect(ReactTestUtils.isElementOfType(customFields.allFields[0].props.children[3], Message))
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
        expect(checkboxField.key)
          .toContain('Can we call you?');
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
        expect(ReactTestUtils.isElementOfType(checkboxField.props.children[2], CheckboxMessage))
          .toEqual(false);
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          payload = [checkboxFieldPayload];
          customFields = getCustomFields(payload, {}, { showErrors: true });

          checkboxField = customFields.allFields[0];
        });

        it('has a Message component', () => {
          expect(ReactTestUtils.isElementOfType(checkboxField.props.children[2], CheckboxMessage))
            .toEqual(true);
        });
      });
    });
  });
});
