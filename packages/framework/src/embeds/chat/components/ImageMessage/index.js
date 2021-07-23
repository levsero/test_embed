import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import useSafeState from 'src/hooks/useSafeState'
import sharedPropTypes from 'src/types/shared'
import { ImageContainer, Link, Spinner, StyledImage } from './styles'

const ImageMessage = ({ placeholderEl, onImageLoad, file }) => {
  const [hasLoaded, setHasLoaded] = useSafeState(false)

  const onLoad = () => {
    if (!hasLoaded) {
      setHasLoaded(true)
      onImageLoad()
    }
  }

  const image = new Image()
  image.src = file.url
  image.onload = onLoad

  const placeholder = placeholderEl || (
    <ImageContainer>
      <Spinner size="4rem" />
    </ImageContainer>
  )

  const linkedImage = (
    <Link data-testid={TEST_IDS.IMAGE_MESSAGE_LINK} target="_blank" href={file.url}>
      <StyledImage src={image.src} />
    </Link>
  )

  return hasLoaded ? linkedImage : placeholder
}

Image.propTypes = {
  url: PropTypes.string.isRequired,
}

ImageMessage.propTypes = {
  placeholderEl: PropTypes.element,
  onImageLoad: PropTypes.func.isRequired,
  file: sharedPropTypes.file.isRequired,
}

export default ImageMessage
