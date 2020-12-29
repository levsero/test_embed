import CarouselMessage from 'src/messages/CarouselMessage'
import MessengerContainer from 'src/messenger/MessengerContainer'
import MessengerHeader from 'src/messenger/MessengerHeader'
import MessengerBody from './'
import MessageLogList from 'src/messenger/MessageLogList'
import MessengerFooter from 'src/messenger/MessengerFooter'

export default {
  title: 'Messenger/MessengerBody',
  component: MessengerBody
}
const flatWhiteItem = {
  _id: '1',
  title: 'A simple Flat White',
  description:
    'The earliest documented references to the beverage date back to Australia in the mid-1980s. A review of the Sydney café Miller…',
  actions: [
    {
      _id: '1',
      uri: 'https://z3n-lhills-nm.zendesk.com/hc/en-us/articles/360056140754-A-simple-Flat-White',
      text: 'View article'
    }
  ]
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
      text: 'View article'
    }
  ]
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
      text: 'View article'
    }
  ]
}

const carouselMessage = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  items: [flatWhiteItem, aeroPressItem, frenchPressItem]
}

const Template = _args => (
  <MessengerContainer>
    <MessengerHeader
      title="Augustine"
      description="Cats sister says hi"
      avatar="https://lucashills.com/emu_avatar.jpg"
      showCloseButton={true}
    />
    <MessengerBody>
      <MessageLogList>
        <CarouselMessage
          label={carouselMessage.label}
          avatar={carouselMessage.avatar}
          items={carouselMessage.items}
        />
      </MessageLogList>
    </MessengerBody>
    <MessengerFooter />
  </MessengerContainer>
)

export const EmptyContainer = Template.bind()
EmptyContainer.args = {}
