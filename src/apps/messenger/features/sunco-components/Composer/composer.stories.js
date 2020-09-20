import React from 'react'
import Composer from './'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
export default {
  title: 'Sunco/Composer',
  component: Composer,
  argTypes: { onSubmit: { action: 'message sent' }, onChange: { action: 'user typed' } }
}

const Template = args => (
  <div style={{ width: 380, height: 700, border: '1px solid black' }}>
    <Composer {...args} />
  </div>
)

export const SingleRowComposer = Template.bind()
SingleRowComposer.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  maxRows: 5,
  minRows: 1,
  message: 'user types this message',
  label: 'Type a message',
  isEnabled: true
}

export const MultiRowComposer = Template.bind()
MultiRowComposer.args = {
  actions: [
    messengerConfigReceived({
      color: { primary: 'green', message: 'purple', action: 'blue' }
    })
  ],
  maxRows: 5,
  minRows: 1,
  message:
    'user types this really long message \n hello \n sdhfjkhsdkfh \n sdkjfkshdfk \n skdjhfkjhsdkfh \n sdfgsf dsgdfgsf sdfg sdfg \n \n dfgfdsg dsfg fdgs \n sdfg df',
  label: 'Type a message',
  isEnabled: true
}
