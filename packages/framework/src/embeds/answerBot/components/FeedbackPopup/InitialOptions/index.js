import PropTypes from 'prop-types'
import { ButtonGroup } from 'src/component/button/ButtonGroup'
import PillButton from 'src/embeds/answerBot/components/PillButton'
import useTranslate from 'src/hooks/useTranslate'

const InitialOptions = ({ onYesClick, onNoClick }) => {
  const translate = useTranslate()

  return (
    <ButtonGroup center={true}>
      <PillButton
        label={translate('embeddable_framework.answerBot.article.feedback.yes')}
        onClick={onYesClick}
      />
      <PillButton
        label={translate('embeddable_framework.answerBot.article.feedback.no.need_help')}
        onClick={onNoClick}
      />
    </ButtonGroup>
  )
}

InitialOptions.propTypes = {
  onNoClick: PropTypes.func,
  onYesClick: PropTypes.func,
}

export default InitialOptions
