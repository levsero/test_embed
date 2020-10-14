import React from 'react'
import Replies from './'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
export default {
  title: 'Sunco/Replies',
  component: Replies,
  argTypes: { submitReply: { action: 'reply submitted' } }
}

const Template = args => <Replies {...args} />

export const TwoReplies = Template.bind()
TwoReplies.args = {
  replies: [
    {
      _id: 'r1',
      type: 'reply',
      text: 'Pizza',
      iconUrl: 'http://example.org/taco.png',
      payload: 'PIZZA'
    },
    {
      _id: 'r2',
      type: 'reply',
      text: 'Crumpets',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'CRUMPETS'
    }
  ],
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ]
}

export const MultipleReplies = Template.bind()
MultipleReplies.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  replies: [
    {
      _id: 'r1',
      type: 'reply',
      text: 'Pizza',
      iconUrl: 'http://example.org/taco.png',
      payload: 'PIZZA'
    },
    {
      _id: 'r2',
      type: 'reply',
      text: 'Crumpets',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'CRUMPETS'
    },
    {
      _id: 'r3',
      type: 'reply',
      text: 'Ice cream with a long name',
      iconUrl: 'http://example.org/taco.png',
      payload: 'Ice cream with a long name'
    },
    {
      _id: 'r4',
      type: 'reply',
      text: 'Chocolate',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'Chocolate'
    },
    {
      _id: 'r5',
      type: 'reply',
      text: 'Cake',
      iconUrl: 'http://example.org/taco.png',
      payload: 'Cake'
    },
    {
      _id: 'r6',
      type: 'reply',
      text: 'Milk',
      iconUrl: 'http://example.org/burrito.png',
      payload: 'Milk'
    }
  ]
}
