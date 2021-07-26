/* eslint no-console:0 */
import { MessengerContainerDecorator } from '../../.storybook/decorators'
import Composer from './'

export default {
  title: 'Components/Composer',
  component: Composer,
  decorators: [MessengerContainerDecorator],
}

const Template = (args) => <Composer {...args} />

export const DefaultProps = Template.bind()
DefaultProps.args = {
  onSendMessage: (value) => console.log('Send message: ', value),
}

export const MultiRowComposer = Template.bind()
MultiRowComposer.args = {
  initialValue:
    'user types this really long message \n hello \n sdhfjkhsdkfh \n sdkjfkshdfk \n skdjhfkjhsdkfh \n sdfgsf dsgdfgsf sdfg sdfg \n \n dfgfdsg dsfg fdgs \n sdfg df',
  onSendMessage: (value) => console.log('Send message: ', value),
}
