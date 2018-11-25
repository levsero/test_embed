import PropTypes from 'prop-types';

const file = PropTypes.shape({
  lastModified: PropTypes.number,
  lastModifiedDate: PropTypes.object, // TODO: verify with _.isDate
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired, // TODO: limit to oneOf a set number of allowed filetypes
  webkitRelativePath: PropTypes.string
});

export default {
  file
};
