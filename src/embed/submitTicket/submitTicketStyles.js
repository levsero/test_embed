import submitTicketComponentStyles from 'component/submitTicket/SubmitTicket.sass';
import submitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';
import dropdownStyles from 'component/field/Dropdown.sass';
import dropdownOptionStyles from 'component/field/DropdownOption.sass';
import dropdownMenuStyles from 'component/field/DropdownMenu.sass';
import { sharedStyles } from 'embed/sharedStyles';

export const submitTicketStyles = `
  ${sharedStyles}
  ${submitTicketComponentStyles}
  ${submitTicketFormStyles}
  ${dropdownStyles}
  ${dropdownOptionStyles}
  ${dropdownMenuStyles}
`;
