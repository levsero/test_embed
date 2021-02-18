import { useState } from 'react'
import SquareLauncher from './index'

export default {
  title: 'Messenger/SquareLauncher',
  component: SquareLauncher,
  argTypes: {},
}

export const Default = (args) => {
  return <SquareLauncher {...args} />
}

export const ClickableExample = (args) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SquareLauncher
      {...args}
      isOpen={isOpen}
      onClick={() => {
        setIsOpen(!isOpen)
      }}
    />
  )
}
