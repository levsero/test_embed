import AttachmentStyles from 'component/attachment/Attachment.sass';
import AttachmentBoxStyles from 'component/attachment/AttachmentBox.sass';
import SubmitTicketComponentStyles from 'component/submitTicket/SubmitTicket.sass';
import SubmitTicketFormStyles from 'component/submitTicket/SubmitTicketForm.sass';
import DropdownStyles from 'component/field/Dropdown.sass';
import DropdownOptionStyles from 'component/field/DropdownOption.sass';
import { sharedStyles } from 'embed/sharedStyles';

export const submitTicketStyles = `
  ${sharedStyles}
  ${AttachmentStyles}
  ${AttachmentBoxStyles}
  ${SubmitTicketComponentStyles}
  ${SubmitTicketFormStyles}
  ${DropdownStyles}
  ${DropdownOptionStyles}
`;
