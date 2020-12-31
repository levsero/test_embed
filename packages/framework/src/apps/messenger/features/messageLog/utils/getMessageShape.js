import { MESSAGE_BUBBLE_SHAPES } from '@zendesk/conversation-components'

const { standalone, first, middle, last } = MESSAGE_BUBBLE_SHAPES

const getMessageShape = (isFirstInGroup, isLastInGroup) => {
  if (isFirstInGroup && isLastInGroup) return standalone
  if (isFirstInGroup) return first
  if (!isFirstInGroup && !isLastInGroup) return middle
  if (isLastInGroup) return last
}

export default getMessageShape
