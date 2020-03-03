import styled from 'styled-components'
import { Body, Footer, FooterItem, Header, Modal } from '@zendeskgarden/react-modals'
import { isMobileBrowser } from 'utility/devices'

const WebWidgetModal = styled(Modal)`
  &&& {
    width: auto;

    margin-bottom: 0;
    max-height: calc(100% - 48px);
    overflow-y: auto;

    top: auto !important;
    right: 24px;
    left: 24px;
    bottom: 24px;

    ${isMobileBrowser() &&
      `
    top: 4rem !important;
    bottom: auto !important;
    `}
  }

  ${Header}, ${Body}, ${Footer} {
    padding: ${props => 16 / props.theme.fontSize}rem ${props => 20 / props.theme.fontSize}rem;
  }

  ${Footer} {
    &&& {
      justify-content: space-between;
    }
  }

  ${FooterItem} {
    flex: 1;

    > * {
      width: 100%;
    }
  }
`

const WebWidgetHeader = styled(Header)`
  &&& {
    font-size: ${props => 14 / props.theme.fontSize}rem;
  }
`

export { WebWidgetModal as Modal, WebWidgetHeader as Header }
export { Close, Body, Footer, FooterItem } from '@zendeskgarden/react-modals'
