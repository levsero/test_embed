/* eslint-disable no-console */
import { withDesign } from 'storybook-addon-designs'
import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import { figmaAddOn, figmaUrl } from '../../../.storybook/figma'
import MessengerFooter from './'

export default {
  title: 'Components/MessengerFooter',
  component: MessengerFooter,
  decorators: [MessengerContainerDecorator, withDesign],
  argTypes: {
    allowedFileTypes: {
      defaultValue: '.pdf,.jpg',
    },
    onFilesSelected: {
      defaultValue: (value) => console.log('onFilesSelected:', value),
    },
  },
}

const Template = (args) => <MessengerFooter {...args} />

export const FooterWithoutFileInputButton = Template.bind()
FooterWithoutFileInputButton.args = {
  isFileInputVisible: false,
}

FooterWithoutFileInputButton.parameters = {
  design: {
    ...figmaAddOn,
    url: figmaUrl.fileUploadFooterButton,
  },
}

export const FooterWithFileInputButton = Template.bind()
FooterWithFileInputButton.args = {
  isFileInputVisible: true,
}

FooterWithFileInputButton.parameters = {
  design: {
    ...figmaAddOn,
    url: figmaUrl.fileUploadFooterButton,
  },
}
