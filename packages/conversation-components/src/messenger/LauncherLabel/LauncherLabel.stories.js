/* eslint-disable no-console */
import LauncherLabel from './'

export default {
  title: 'Messenger/LauncherLabel',
  component: LauncherLabel,
  argTypes: {
    onCloseClick: {
      defaultValue: () => console.log('Close Clicked'),
    },
    onLabelClick: {
      defaultValue: () => console.log('Label Clicked'),
    },
    position: {
      defaultValue: 'right',
      control: {
        type: 'inline-radio',
        options: ['left', 'right'],
      },
    },
    text: {
      defaultValue: 'Default Text',
    },
  },
}

export const DefaultLauncherLabel = (args) => <LauncherLabel {...args} />
