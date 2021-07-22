/* eslint no-console:0 */
import { MessageLogListDecorator, MessengerContainerDecorator } from '../../.storybook/decorators'
import Replies from './'

export default {
  title: 'Components/Replies',
  component: Replies,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
}

const Template = (args) => <Replies {...args} />
const onReplyClickHandler = (reply) => console.log('onReply(reply) click handler. reply:', reply)

export const TwoReplies = Template.bind()
TwoReplies.args = {
  replies: [
    {
      _id: 'r1',
      type: 'reply',
      text: 'Pizza',
      iconUrl: 'http://example.org/taco.png',
      payload: 'PIZZA',
    },
    {
      _id: 'r2',
      type: 'reply',
      text: 'Crumpets',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'CRUMPETS',
    },
  ],
  onReply: onReplyClickHandler,
}

export const MultipleReplies = Template.bind()
MultipleReplies.args = {
  replies: [
    {
      _id: 'r1',
      type: 'reply',
      text: 'Pizza',
      iconUrl: 'http://example.org/taco.png',
      payload: 'PIZZA',
    },
    {
      _id: 'r2',
      type: 'reply',
      text: 'Crumpets',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'CRUMPETS',
    },
    {
      _id: 'r3',
      type: 'reply',
      text: 'Ice cream with a long name',
      iconUrl: 'http://example.org/taco.png',
      payload: 'Ice cream with a long name',
    },
    {
      _id: 'r4',
      type: 'reply',
      text: 'Chocolate',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'Chocolate',
    },
    {
      _id: 'r5',
      type: 'reply',
      text: 'Cake',
      iconUrl: 'http://example.org/taco.png',
      payload: 'Cake',
    },
    {
      _id: 'r6',
      type: 'reply',
      text: 'Milk',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'Milk',
    },
  ],
  onReply: onReplyClickHandler,
}
