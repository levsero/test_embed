import ThemeProvider from 'src/ThemeProvider'
import TextButton from './index'

export default {
  title: 'Components/TextButton',
  component: TextButton,
}

/* eslint-disable react/prop-types */
const Template = ({ ...props }) => (
  <ThemeProvider>
    <TextButton {...props}>Some text</TextButton>
  </ThemeProvider>
)

export const Button = Template.bind()
Button.args = {
  text: 'Some text',
}

export const Anchor = Template.bind()
Anchor.args = {
  text: 'Some text',
  href: 'www.google.com',
}
