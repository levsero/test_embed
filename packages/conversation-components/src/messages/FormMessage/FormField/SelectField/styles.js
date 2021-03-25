import styled from 'styled-components'

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

export { Container }
