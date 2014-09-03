/** @jsx React.DOM */

module React from 'react/addons';
module ReactForms from 'react-forms';

import { SearchField } from 'component/FormField';
import { i18n }      from 'service/i18n';

var { Schema } = ReactForms.schema;

export var helpCenterSchema = (
  /* jshint quotmark:false */
  <Schema>
    <SearchField
      name='helpCenterSearchField'
      ref='helpCenterSearchField'
      autoComplete='off'
      placeholder={i18n.t('embeddable_framework.helpCenter.search.label')}
    />
  </Schema>
);
