import LogoIcon from 'classicSrc/asset/icons/widget-icon_zendesk.svg'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { rgba } from 'polished'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { zdColorGrey600, zdColorGrey800 } from '@zendeskgarden/css-variables'
import { getZendeskLogoLink } from './selectors'

const Link = styled.a`
  ${(props) => {
    return `
      position: relative;
      display: inline-block;

      &[data-garden-focus-visible] {
        box-shadow: ${props.theme.shadows.md(rgba(props.theme.baseHighlightColor, 0.2))};
        border-radius: 4px;
        background-color: ${props.theme.shadows.md(rgba(props.theme.baseHighlightColor, 0.2))};

        padding: ${4 / props.theme.fontSize}rem;
        margin: ${-4 / props.theme.fontSize}rem;
      }

      svg {
        min-width: ${50 / props.theme.fontSize}rem;
        width: ${50 / props.theme.fontSize}rem;
        height: ${10 / props.theme.fontSize}rem;

        &:hover,
        &:active,
        &:focus {
          path {
            fill: ${zdColorGrey800};
          }
        }

        path {
          fill: ${zdColorGrey600};
        }
      }
    `
  }}
`

const ZendeskLogo = ({ href }) => (
  <Link data-testid={TEST_IDS.ICON_ZENDESK} href={href} target="_blank">
    <LogoIcon title="zendesk" />
  </Link>
)

ZendeskLogo.propTypes = {
  href: PropTypes.string.isRequired,
}

const mapStateToProps = (state, props) => ({
  href: getZendeskLogoLink(state, props.linkToChat),
})

const connectedComponent = connect(mapStateToProps)(ZendeskLogo)

export { connectedComponent as default, ZendeskLogo as Component }
