import { ButtonGroup } from 'classicSrc/component/button/ButtonGroup'
import PillButton from 'classicSrc/embeds/answerBot/components/PillButton'
import useTranslate from 'classicSrc/hooks/useTranslate'
import PropTypes from 'prop-types'

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
