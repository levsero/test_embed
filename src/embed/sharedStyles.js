import CheckboxStyles from 'component/field/Checkbox.scss';
import LoadingSpinnerStyles from 'component/loading/LoadingSpinner.scss';
import ScrollContainerStyles from 'component/container/ScrollContainer.scss';
import AvatarStyles from 'component/Avatar.scss';
import IconStyles from 'component/Icon.scss';
import ButtonStyles from 'component/button/Button.scss';
import ButtonNavStyles from 'component/button/ButtonNav.scss';
import ZendeskLogoStyles from 'component/ZendeskLogo.scss';
import NavigationStyles from 'component/frame/Navigation.scss';
import TextFieldStyles from '@zendeskgarden/react-textfields/dist/styles.css';

export const sharedStyles = `
  ${CheckboxStyles}
  ${LoadingSpinnerStyles}
  ${ScrollContainerStyles}
  ${AvatarStyles}
  ${ButtonStyles}
  ${ButtonNavStyles}
  ${ZendeskLogoStyles}
  ${IconStyles}
  ${NavigationStyles}
  ${TextFieldStyles.toString()}
`;
