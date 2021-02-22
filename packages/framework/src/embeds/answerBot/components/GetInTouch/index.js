import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import { Container, Button } from './styles'

const GetInTouch = ({ onClick }) => {
  const translate = useTranslate()
  return (
    <Container>
      <Button
        label={translate('embeddable_framework.answerBot.button.get_in_touch')}
        onClick={onClick}
      />
    </Container>
  )
}

GetInTouch.propTypes = {
  onClick: PropTypes.func,
}

export default GetInTouch
