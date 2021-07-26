import CarouselStyles from 'src/embeds/chat/components/Carousel/Carousel.scss'
import QuickRepliesStyles from 'src/embeds/chat/components/QuickReplies/QuickReplies.scss'
import SliderContainerStyles from 'src/embeds/chat/components/SliderContainer/SliderContainer.scss'
import KeyboardFocusButton from './KeyboardFocusButton/KeyboardFocusButton.scss'
import MessageBubbleStyles from './MessageBubble/MessageBubble.scss'
import MessageOptionsStyles from './MessageOptions/MessageOptions.scss'
import ButtonCardStyles from './StructuredMessage/ButtonCard.scss'
import ListCardStyles from './StructuredMessage/ListCard.scss'
import ButtonStyles from './StructuredMessage/pure/Button.scss'
import ButtonListStyles from './StructuredMessage/pure/ButtonList.scss'
import CardStyles from './StructuredMessage/pure/Card.scss'
import PanelStyles from './StructuredMessage/pure/Panel.scss'

const styles = `
  ${MessageBubbleStyles}
  ${MessageOptionsStyles}
  ${QuickRepliesStyles}
  ${ButtonStyles}
  ${ButtonListStyles}
  ${CardStyles}
  ${PanelStyles}
  ${ButtonCardStyles}
  ${SliderContainerStyles}
  ${CarouselStyles}
  ${ListCardStyles}
  ${KeyboardFocusButton}
`

export default styles
