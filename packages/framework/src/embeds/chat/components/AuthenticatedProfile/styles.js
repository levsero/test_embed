import styled from 'styled-components'
import {
  zdColorGrey100,
  zdColorGrey300,
  zdColorGrey500,
  zdColorGrey600,
  zdColorGrey800,
} from '@zendeskgarden/css-variables'
import TrashIcon from '@zendeskgarden/svg-icons/src/16/trash-fill.svg'
import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { Avatar } from 'component/Avatar'

const AuthenticatedProfileContainer = styled.div`
  position: relative;
  word-break: break-all;
  color: ${zdColorGrey800};
  background-color: ${zdColorGrey100};
  border: ${(props) => 1 / props.theme.fontSize}rem solid ${zdColorGrey300};
  border-radius: ${(props) => 4 / props.theme.fontSize}rem;
  margin-bottom: ${(props) => 15 / props.theme.fontSize}rem;
  margin-top: ${(props) => 8 / props.theme.fontSize}rem;
  min-height: ${(props) => 35 / props.theme.fontSize}rem;
  padding-top: ${(props) => 8 / props.theme.fontSize}rem;
  padding-bottom: ${(props) => 8 / props.theme.fontSize}rem;
  padding-left: ${(props) => 15 / props.theme.fontSize}rem;
  line-height: ${(props) => 18 / props.theme.fontSize}rem;

  ${(props) =>
    props.theme.rtl &&
    `padding-left: 0;
      padding-right: ${15 / props.theme.fontSize}rem;`}
`

const LogoutIcon = styled(TrashIcon)`
  cursor: pointer;
  position: absolute;
  top: ${(props) => 18 / props.theme.fontSize}rem;
  color: ${zdColorGrey500};

  ${(props) =>
    props.theme.rtl === false &&
    `
    right: ${16 / props.theme.fontSize}rem;
    `}

  ${(props) =>
    props.theme.rtl &&
    `
    left: ${16 / props.theme.fontSize}rem;
    `}

  path {
    fill: ${zdColorGrey500};
  }

  &:hover,
  &:focus,
  &:active {
    path {
      fill: ${zdColorGrey600};
    }
  }
`

const LoadingSpinnerIcon = styled(LoadingSpinner)`
  position: absolute;
  top: ${(props) => 10 / props.theme.fontSize}rem;
  color: ${zdColorGrey500};
  height: ${(props) => 15 / props.theme.fontSize}rem;
  width: ${(props) => 15 / props.theme.fontSize}rem;

  ${(props) =>
    props.theme.rtl === false &&
    `
    right: ${16 / props.theme.fontSize}rem;
    `}

  ${(props) =>
    props.theme.rtl &&
    `
    left: ${16 / props.theme.fontSize}rem;
    `}
`

const SocialAvatar = styled(Avatar)`
  &&& {
    display: inline-block !important;
    vertical-align: top;
    height: ${(props) => 30 / props.theme.fontSize}rem;
    width: ${(props) => 30 / props.theme.fontSize}rem;
    margin-top: ${(props) => 2 / props.theme.fontSize}rem;
    svg {
      min-height: ${(props) => 30 / props.theme.fontSize}rem;
      min-width: ${(props) => 30 / props.theme.fontSize}rem;
      max-height: ${(props) => 30 / props.theme.fontSize}rem;
      max-width: ${(props) => 30 / props.theme.fontSize}rem;
    }
  }
`

export { AuthenticatedProfileContainer, LogoutIcon, LoadingSpinnerIcon, SocialAvatar }
