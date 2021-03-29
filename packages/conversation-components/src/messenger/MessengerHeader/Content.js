import { Avatar, Description, Details, Title } from 'src/messenger/MessengerHeader/styles'
import useLabels from 'src/hooks/useLabels'
import PropTypes from 'prop-types'

const Content = ({ title, description, avatar }) => {
  const labels = useLabels().messengerHeader

  return (
    <>
      {avatar && (
        <Avatar isSystem={true}>
          <img src={avatar} alt={labels.avatarAltTag} />
        </Avatar>
      )}
      <Details>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </Details>
    </>
  )
}

Content.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  avatar: PropTypes.string,
}

export default Content