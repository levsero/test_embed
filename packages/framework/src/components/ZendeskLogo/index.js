import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { getZendeskLogoLink } from './selectors'
import { TEST_IDS } from 'src/constants/shared'
import LogoIcon from 'icons/widget-icon_zendesk.svg'

import { zdColorGrey600, zdColorGrey500 } from '@zendeskgarden/css-variables'

const Link = styled.a`
  ${(props) => {
    return `
      position: relative;
      display: inline-block;

      svg {
        min-width: ${50 / props.theme.fontSize}rem;
        width: ${50 / props.theme.fontSize}rem;
        height: ${10 / props.theme.fontSize}rem;

        &:hover,
        &:active,
        &:focus {
          path {
            fill: ${zdColorGrey600};
          }
        }

        path {
          fill: ${zdColorGrey500};
        }
      }
  `
  }}
`

const ZendeskLogo = ({ href }) => (
  <Link data-testid={TEST_IDS.ICON_ZENDESK} href={href} target="_blank" tabIndex="-1">
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
