import { Widget, Header } from 'classicSrc/components/Widget'
import CallbackForm from 'classicSrc/embeds/talk/components/CallbackForm'
import useGetTitle from 'classicSrc/embeds/talk/hooks/useGetTitle'

const CallbackAndPhonePage = () => {
  const getTitle = useGetTitle()

  return (
    <Widget>
      <Header title={getTitle('embeddable_framework.talk.form.title')} />
      <CallbackForm showCallbackNumber={true} />
    </Widget>
  )
}

export default CallbackAndPhonePage
