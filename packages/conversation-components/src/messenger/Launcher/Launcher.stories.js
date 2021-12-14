import { useState } from 'react'
import { withDesign } from 'storybook-addon-designs'
import { LAUNCHER_SHAPES, LAUNCHER_POSITION } from 'src/constants'
import { figmaAddOn, figmaUrl } from '../../../.storybook/figma'
import Launcher from './index'

export default {
  title: 'Messenger/Launcher',
  component: Launcher,
  decorators: [withDesign],
  argTypes: {
    shape: {
      defaultValue: LAUNCHER_SHAPES.square,
      control: {
        type: 'select',
        options: [LAUNCHER_SHAPES.circle, LAUNCHER_SHAPES.square],
      },
    },
    position: {
      defaultValue: LAUNCHER_POSITION.right,
      control: {
        type: 'select',
        options: Object.values(LAUNCHER_POSITION),
      },
    },
  },
}

export const DefaultLauncher = (args) => {
  return <Launcher {...args} />
}

DefaultLauncher.parameters = {
  design: {
    ...figmaAddOn,
    url: figmaUrl.launcherShapes,
  },
}

export const ClickableLauncher = (args) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Launcher
      {...args}
      isOpen={isOpen}
      onClick={() => {
        setIsOpen(!isOpen)
      }}
    />
  )
}

ClickableLauncher.parameters = {
  design: {
    ...figmaAddOn,
    url: figmaUrl.launcherShapes,
  },
}
