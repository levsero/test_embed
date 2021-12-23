import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'
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
