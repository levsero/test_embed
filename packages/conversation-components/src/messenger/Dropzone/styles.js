import { rgba, rem } from 'polished'
import styled from 'styled-components'
import ShareStroke from '@zendeskgarden/svg-icons/src/16/share-stroke.svg'

const animatedDuration = 0.2

const DropzoneContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const DropzoneActiveContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => rgba(props.theme.palette.white, 0.9)};
  font-family: ${(props) => props.theme.messenger.fontFamily};
  transition: opacity ${animatedDuration}s ease-in;
  opacity: ${(props) => (props.state === 'entering' ? 1 : props.state === 'exiting' ? 0 : null)};
  z-index: 1;
`

const UploaderContainer = styled.div`
  width: ${(props) => rem(160, props.theme.messenger.baseFontSize)};
  height: ${(props) => rem(160, props.theme.messenger.baseFontSize)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: ${(props) => props.theme.palette.white};
  border: 1px dashed ${(props) => props.theme.palette.grey[600]};
  box-sizing: border-box;
  border-radius: ${(props) => rem(4, props.theme.messenger.baseFontSize)};
`

const Text = styled.p`
  font-size: ${(props) => props.theme.messenger.fontSizes.lg};
  margin-top: ${(props) => rem(36, props.theme.messenger.baseFontSize)};
  margin-bottom: 0;
  font-weight: ${(props) => props.theme.fontWeights.light};
  color: ${(props) => props.theme.palette.grey[600]};
`

const UploadIcon = styled(ShareStroke)`
  width: ${(props) => rem(36, props.theme.messenger.baseFontSize)};
  height: ${(props) => rem(36, props.theme.messenger.baseFontSize)};
  color: ${(props) => props.theme.palette.grey[600]};
`

export { DropzoneContainer, DropzoneActiveContainer, UploaderContainer, Text, UploadIcon }
