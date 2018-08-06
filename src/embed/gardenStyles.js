import textFieldStyles from '@zendeskgarden/react-textfields/dist/styles.css';
import selectStyles from '@zendeskgarden/react-select/dist/styles.css';
import checkboxStyles from '@zendeskgarden/react-checkboxes/dist/styles.css';
import buttonStyles from '@zendeskgarden/react-buttons/dist/styles.css';
import notificationStyles from '@zendeskgarden/react-notifications/dist/styles.css';

export default `
  ${textFieldStyles.toString()}
  ${selectStyles.toString()}
  ${checkboxStyles.toString()}
  ${buttonStyles.toString()}
  ${notificationStyles.toString()}
`;
