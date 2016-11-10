const http = require('http');
const _ = require('lodash');

const fields = [
  '{ "ticket_field": { "type": "text", "title": "textField", "visible_in_portal": "true", "editable_in_portal": "true", "required_in_portal": "true" } }',
  '{ "ticket_field": { "type": "textarea", "title": "textareaField", "visible_in_portal": "true", "editable_in_portal": "true", "required_in_portal": "false" } }',
  '{ "ticket_field": { "type": "checkbox", "title": "checkboxField", "visible_in_portal": "true", "editable_in_portal": "true", "required_in_portal": "false" } }',
  '{ "ticket_field": { "type": "integer", "title": "integerField", "visible_in_portal": "true", "editable_in_portal": "true", "required_in_portal": "false" } }',
  '{ "ticket_field": { "type": "decimal", "title": "decimalField", "visible_in_portal": "true", "editable_in_portal": "true", "required_in_portal": "false" } }',
  `{ "ticket_field": { "type": "tagger", "title": "taggerField", "custom_field_options": [{ "name": "Option1", "value": "${Math.random()}" }, {"name": "Option2", "value": "${Math.random()}"}], "visible_in_portal": "true", "editable_in_portal": "true", "required_in_portal": "false" } }`,
];

const options = {
  host: 'dev.zd-dev.com',
  path: '/api/v2/ticket_fields.json',
  method: 'POST',
  auth: 'admin@zendesk.com:123456',
  json: true,
  headers: { "content-type": "application/json" }
};

function createTicketForm(fieldIds) {
  console.log('Creating Ticket Form');

  options.path = '/api/v2/ticket_forms.json';

  const ticketFormRequest = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (data) => {
      console.log(`DONE! ticket form id: ${JSON.parse(data).ticket_form.id}`);
    });
  });

  ticketFormRequest.on('error', (e) => {
      console.log(`problem with ticket form request: ${e.message}`);
  });

  ticketFormRequest.write(`{
    "ticket_form": {
      "name": "Test Form",
      "end_user_visible": true,
      "display_name": "Ticket Formz",
      "active": true,
      "default": false,
      "position": 2,
      "ticket_field_ids": [${fieldIds}]
    }
  }`);

  ticketFormRequest.end();
}

function createTicketFields() {
  console.log('Creating Ticket Fields')

  const fieldIds = [];

  _.forEach(fields, (field) => {
    const ticketFieldsRequest = http.request(options, (res) => {

      res.setEncoding('utf8');
      res.on('data', (data) => {
        const id = JSON.parse(data).ticket_field.id;

        console.log(`STATUS: ${res.statusCode} created field: ${id}`);
        fieldIds.push(id);

        if (fieldIds.length === fields.length) {
          createTicketForm(fieldIds);
        }
      });
    });

    ticketFieldsRequest.on('error', (e) => {
      console.log(`problem with ticket field request: ${e.message}`);
    });

    ticketFieldsRequest.write(field);
    ticketFieldsRequest.end();
  });
}

createTicketFields();
