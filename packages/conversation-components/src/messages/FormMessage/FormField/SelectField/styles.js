import styled from 'styled-components'
import { Dropdown, Menu, Item, Select, Label } from '@zendeskgarden/react-dropdowns'
import { rgba, rem } from 'polished'

// Garden currently has incorrect styles applying to the "hidden" input where it gives the input width 100%
// This pushes the dropdown off page for us.
// Forcing the width back to 1px is a temp fix until this can be fixed in Garden
// Thead discussing this: https://zendesk.slack.com/archives/C0AANB3HS/p1605224561185300
const Container = styled.div`
  position: relative;

  input {
    width: 1px !important;
  }
`

const StyledDropdown = styled(Dropdown)`
  &&& {
    border-color: ${props => props.theme.messenger.colors.action};
  }
`

const StyledSelect = styled(Select)`
  &&& {
    border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
    font-size: ${props => props.theme.messenger.fontSizes.md};
    line-height: ${props => props.theme.messenger.lineHeights.md};
    min-height: auto;

    svg {
      height: ${props => props.theme.messenger.space.sixteen};
      width: ${props => props.theme.messenger.space.sixteen};
      margin: ${`${props => rem(1, props.theme.messenger.baseFontSize)} 0 auto ${props =>
        rem(8, props.theme.messenger.baseFontSize)}`};
    }

    ${props =>
      props.validation === undefined &&
      `
        &:hover,
        &:focus,
        &:active,
        &[data-garden-focus-visible] {
          border: ${props.theme.borders.sm} ${props.theme.palette.grey[500]};
        }

        :hover {
          border: ${props.theme.borders.sm} ${props.theme.palette.grey[500]};
        }

        :active {
          box-shadow: ${props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.4))};
        }

        :focus,
        &[data-garden-focus-visible] {
          box-shadow: ${props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.45))};
        }

        ${props.isOpen &&
          `
          border: ${props.theme.borders.sm} ${props.theme.messenger.colors.action};
          box-shadow: ${props.theme.shadows.md(rgba(props.theme.messenger.colors.action, 0.35))};
        `}
      `}
  }
`

const StyledItem = styled(Item)`
  &&& {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: ${props => props.theme.messenger.space.xs}
      ${props => rem(36, props.theme.messenger.baseFontSize)};
    line-height: ${props => props.theme.messenger.lineHeights.md};
    font-size: ${props => props.theme.messenger.fontSizes.md};
    height: ${props => props.theme.messenger.space.xxl};
    border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
    margin-left: ${props => props.theme.messenger.space.xs};
    margin-right: ${props => props.theme.messenger.space.xs};

    &:first-child {
      margin-top: ${props => props.theme.messenger.space.xxs};
    }

    &:hover,
    &:focus,
    &:active,
    &[aria-selected='true'],
    &[data-garden-focus-visible] {
      background-color: ${props => rgba(props.theme.messenger.colors.action, 0.08)};
    }
  }
`

const StyledLabel = styled(Label)`
  &&& {
    font-size: ${props => props.theme.messenger.fontSizes.md};
  }
`

const StyledMenu = styled(Menu)`
  &&& {
    border-radius: ${props => props.theme.messenger.borderRadii.textMessage};
  }
`
export {
  StyledDropdown as Dropdown,
  StyledSelect as Select,
  StyledItem as Item,
  StyledLabel as Label,
  StyledMenu as Menu,
  Container
}
