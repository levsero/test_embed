import { useState } from 'react'
import { LAUNCHER_SHAPES, LAUNCHER_POSITION } from 'src/constants'
import Launcher from './index'

export default {
  title: 'Messenger/Launcher',
  component: Launcher,
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

export const Default = (args) => {
  return <Launcher {...args} />
}

export const ClickableExample = (args) => {
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
