const unorderedTextMessages = {
  messages: [
    {
      _id: 1,
      type: 'text',
      text: 'One',
      role: 'appUser',
      received: 100
    },
    {
      _id: 2,
      type: 'text',
      text: 'Two',
      role: 'appUser',
      received: 50
    },
    {
      _id: 3,
      type: 'text',
      text: 'Three',
      role: 'business',
      received: 150
    }
  ]
}

const messagesWithDifferentAuthors = {
  messages: [
    {
      _id: 1,
      type: 'text',
      text: 'One',
      role: 'business',
      received: 1
    },
    {
      _id: 2,
      type: 'text',
      text: 'Two',
      role: 'appUser',
      received: 2
    },
    {
      _id: 3,
      type: 'text',
      text: 'Three',
      role: 'appUser',
      received: 3
    }
  ]
}

const messagesWithDifferentTypes = {
  messages: [
    {
      _id: 1,
      type: 'image',
      src: 'cat image',
      role: 'appUser',
      received: 1
    },
    {
      _id: 2,
      type: 'text',
      text: 'Two',
      role: 'appUser',
      received: 2
    },
    {
      _id: 3,
      type: 'text',
      text: 'Three',
      role: 'appUser',
      received: 3
    }
  ]
}

const messagesWithReplies = {
  messages: [
    {
      _id: 1,
      type: 'text',
      text: 'One',
      role: 'business',
      received: 1,
      actions: [
        {
          _id: 'r3',
          type: 'reply',
          text: 'Pizza',
          iconUrl: 'http://example.org/taco.png',
          payload: 'PIZZA'
        }
      ]
    },
    {
      _id: 2,
      type: 'text',
      text: 'Two',
      role: 'appUser',
      received: 2
    },
    {
      _id: 3,
      type: 'text',
      text: 'Three',
      role: 'appUser',
      received: 3,
      actions: [
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
      ]
    }
  ]
}

export {
  messagesWithDifferentTypes,
  messagesWithDifferentAuthors,
  unorderedTextMessages,
  messagesWithReplies
}
