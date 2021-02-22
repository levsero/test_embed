import CallbackForm from 'src/embeds/talk/components/CallbackForm'
import { Widget, Header } from 'src/components/Widget'
import useGetTitle from 'src/embeds/talk/hooks/useGetTitle'

const CallbackOnlyPage = () => {
  const getTitle = useGetTitle()

  return (
    <Widget>
      <Header title={getTitle('embeddable_framework.talk.form.title')} />
      <CallbackForm showCallbackNumber={false} />
    </Widget>
  )
}

export default CallbackOnlyPage
