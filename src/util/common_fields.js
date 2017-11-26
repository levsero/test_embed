import { Field } from 'component/field/Field';
import React from 'react';

export function renderTextField(name, label, value, required = false) {
  return (
    <Field
      label={label}
      required={required}
      value={value}
      name={name} />
  );
}

export function renderTextAreaField(name, label, value, required = false) {
  return (
    <Field
      label={label}
      required={required}
      value={value}
      input={<textarea rows='3' />}
      name={name} />
  );
}

export function renderPhoneField(name, label, value, required = false) {
  return (
    <Field
      label={label}
      required={required}
      value={value}
      name={name} />
  );
}

export function renderEmailField(name, label, value, required = false) {
  return (
    <Field
      label={label}
      required={required}
      value={value}
      pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?" // eslint-disable-line
      name={name} />
  );
}
