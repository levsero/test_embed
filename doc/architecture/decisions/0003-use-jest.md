# 3. Use

Date: 2018-09-25

## Attendees
- Wayne See
- Adrian Evans
- Briana Coppard
- Anthony Del Ciotto
- Terence Liew
- Adrian Yong
- Apoorv Kansal
- Daniel Bradford

## Status

Accepted

## Context

One of the pain points for developing in the web widget is writing the unit tests. The current unit tests test all components in isolation,
and all dependencies and imports are mocked out using a library called Mockery. Having to mock out all imports is cumbersome, which slows
down team velocity and productivity. It also makes tests brittle, as adding a new import in a file will make all tests in that test file
break. In addition, since components are tested in isolation, bugs can escape detection if it occurs in the interaction between components.

## Decision

It was decided that [Jest](https://jestjs.io/) is an acceptable test framework to replace the current one. It can replace Jasmine as the test
runner, and also provides a mocking library. As a test runner, it does not need
Webpack to run, and will import all dependencies and import properly. It has good community support, and is actively maintained.
It also offers additional features that the team can adopt later on, like built-in code coverage tracking and snapshot testing.

For testing React components, the team will try out [react-testing-library](https://github.com/kentcdodds/react-testing-library#readme),
with the hopes that it will allow the team to write maintainable tests, without sacrificing velocity. React-testing-library was
chosen because it prevents developers from testing implementation details, and instead focus only on testing behaviour.


## Consequences

New tests will be written using the new test framework. Tests using the old framework will be kept until they are slowly replaced
by the new tests.
