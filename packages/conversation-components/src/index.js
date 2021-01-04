import {
  FORM_MESSAGE_STATUS,
  BANNER_STATUS,
  MESSAGE_BUBBLE_SHAPES,
  MESSAGE_STATUS
} from './constants'

import Animated from './Animated'
import Avatar from './Avatar'
import Banner from './Banner'
import CarouselMessage from './messages/CarouselMessage'
import FileMessage from './messages/FileMessage'
import FormMessage from './messages/FormMessage'
import FormResponseMessage from './messages/FormResponseMessage'
import ImageMessage from './messages/ImageMessage'
import Label from './Label'
import MessageBubble from './MessageBubble' //TODO - shouldn't need to export this
import MessageLogList from './messenger/MessageLogList' //TODO - shouldn't need to export this
import MessengerContainer from './messenger/MessengerContainer'
import MessengerFooter from './messenger/MessengerFooter'
import MessengerHeader from './messenger/MessengerHeader'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout' //TODO - shouldn't need to export this
import OtherParticipantReceipt from 'src/receipts/OtherParticipantReceipt'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout' //TODO - shouldn't need to export this
import PrimaryParticipantReceipt from 'src/receipts/PrimaryParticipantReceipt'
import Replies from 'src/Replies'
import { ScrollProvider, useScroll } from 'src/hooks/useScrollBehaviour'
import TextMessage from './messages/TextMessage'
import Timestamp from './Timestamp' // TODO - should this be a 'message'?
import ThemeProvider from './ThemeProvider'

export {
  Animated,
  Avatar,
  Banner,
  CarouselMessage,
  FileMessage,
  FormMessage,
  FormResponseMessage,
  ImageMessage,
  Label,
  MessageBubble,
  MessageLogList,
  MessengerContainer,
  MessengerFooter,
  MessengerHeader,
  OtherParticipantReceipt,
  OtherParticipantLayout,
  PrimaryParticipantLayout,
  PrimaryParticipantReceipt,
  Replies,
  ScrollProvider,
  TextMessage,
  Timestamp,
  ThemeProvider,
  useScroll
}

export { FORM_MESSAGE_STATUS, BANNER_STATUS, MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS }
