import {
  CarouselMessage,
  MessengerContainer,
  MessengerHeader,
  MessengerBody,
  MessageLogList,
  MessengerFooter,
  Replies,
  TextMessage,
} from 'src/'
import Previewer from 'src/messenger/Previewer'
import SquareLauncher from '../Launcher/SquareLauncher'

const flatWhiteItem = {
  _id: '1',
  title: 'A simple Flat White',
  description:
    'The earliest documented references to the beverage date back to Australia in the mid-1980s. A review of the Sydney café Miller…',
  actions: [
    {
      _id: '1',
      uri: 'https://z3n-lhills-nm.zendesk.com/hc/en-us/articles/360056140754-A-simple-Flat-White',
      text: 'View article',
    },
  ],
}

const aeroPressItem = {
  _id: '2',
  title: 'Making coffee with an AeroPress',
  description:
    'The AeroPress is a device for brewing coffee. It was invented in 2005 by Aerobie president Alan Adler. Coffee is steeped for …',
  actions: [
    {
      _id: '2',
      uri:
        'https://z3n-lhills-nm.zendesk.com/hc/en-us/articles/360057988733-Making-coffee-with-an-AeroPress',
      text: 'View article',
    },
  ],
}

const frenchPressItem = {
  _id: '3',
  title: 'What is a French Press?',
  description:
    'A French press, also known as a cafetière, cafetière à piston, caffettiera a stantuffo, press pot, coffee press, or coffee…',
  actions: [
    {
      _id: '3',
      uri:
        'https://z3n-lhills-nm.zendesk.com/hc/en-us/articles/360056140694-What-is-a-French-Press-',
      text: 'View article',
    },
  ],
}

const carouselMessage = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  items: [flatWhiteItem, aeroPressItem, frenchPressItem],
}

const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const textmessageProps = {
  isPrimaryParticipant: true,
  isFirstInGroup: false,
  timeReceived: timeNowInSeconds,
  isReceiptVisible: false,
}

const quickReplies = [
  { _id: 'r1', type: 'reply', text: 'Pizza' },
  { _id: 'r2', type: 'reply', text: 'Crumpets' },
  { _id: 'r3', type: 'reply', text: 'Chocolate' },
  { _id: 'r4', type: 'reply', text: 'Cake' },
]

export default {
  title: 'Messenger/Previewer',
  component: Previewer,
  argTypes: {},
}

export const Basic = (args) => {
  return (
    <Previewer {...args}>
      <MessengerContainer>
        <MessengerHeader
          title="Augustine"
          description="Cats sister says hi"
          avatar="https://lucashills.com/emu_avatar.jpg"
          showCloseButton={true}
        />
        <MessengerBody>
          <MessageLogList>
            <TextMessage
              isFirstInGroup={true}
              label="Answer Bot"
              shape="first"
              text="Hi there. Ask me a question and I'll try to help."
              isReceiptVisible={false}
            />
            <TextMessage
              isFirstInGroup={false}
              avatar="https://accounts.zendesk.com/flow_director/assets/default_avatar.png"
              shape="last"
              text="Or talk to a human."
              isReceiptVisible={true}
              timeReceived={timeNowInSeconds}
            />
            <CarouselMessage
              label={carouselMessage.label}
              avatar={carouselMessage.avatar}
              items={carouselMessage.items}
            />
            <TextMessage
              {...textmessageProps}
              isFirstInGroup={true}
              label="Majestic Emus"
              shape="first"
              text="Emus are lovely"
            />
            <TextMessage {...textmessageProps} shape="middle" text="Clifton baby made up Collins" />
            <TextMessage
              {...textmessageProps}
              shape="last"
              text="Have you ever tried that fool"
              avatar="https://lucashills.com/emu_avatar.jpg"
              isReceiptVisible={true}
            />
            <Replies isVisible={true} replies={quickReplies} />
          </MessageLogList>
        </MessengerBody>
        <MessengerFooter />
      </MessengerContainer>
      <SquareLauncher isOpen={true} position={args.position} />
    </Previewer>
  )
}
