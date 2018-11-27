import PropTypes from 'prop-types';

const file = PropTypes.shape({
  lastModified: PropTypes.number,
  lastModifiedDate: PropTypes.object, // TODO: verify with _.isDate
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  mime_type: PropTypes.string.isRequired, // eslint-disable-line camelcase
  // TODO: limit to oneOf a set number of allowed filetypes
  webkitRelativePath: PropTypes.string
});

export default {
  file
};
