import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { OptionsList, ListItem, Button } from './styles'

const MessageOptions = ({ options = [], onSelect }) => {
  return (
    <OptionsList>
      {options.map((option, index) => (
        <ListItem key={`${option}-${index}`}>
          <Button onClick={() => onSelect(option)}>
            <div data-testid={TEST_IDS.MESSAGE_OPTION}>{option}</div>
          </Button>
        </ListItem>
      ))}
    </OptionsList>
  )
}

MessageOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func.isRequired,
}

export default MessageOptions
