export default class MockWebWidget extends Component {
  constructor() {
    super()
    this.backtrackSearch = noop
    this.contextualSearch = noop
    this.performSearch = noop
    this.focusField = noop
    this.setAuthenticated = noop
    this.state = {
      topics: [],
      searchCount: 0,
      searchTerm: '',
      hasSearched: false,
      showIntroScreen: false,
    }
  }

  getActiveComponent() {
    return this.refs.mockChild
  }

  getSubmitTicketComponent() {
    return this.refs.mockChild
  }

  getHelpCenterComponent() {
    return this.refs.mockChild
  }

  show() {}

  showChat() {}

  showProactiveChat() {}

  dismissStandaloneChatPopup() {}

  render() {
    return (
      <div className="mock-webWidget">
        <MockWebWidgetChild ref="mockChild" />
      </div>
    )
  }
}

// SubmitTicket/Chat/HelpCenter
class MockWebWidgetChild extends Component {
  constructor() {
    super()
    this.backtrackSearch = noop
    this.contextualSearch = noop
    this.performSearch = noop
    this.focusField = noop
    this.updateUser = noop
    this.setLoading = noop
    this.clearAttachments = noop
    this.state = {
      topics: [],
      searchCount: 0,
      searchTerm: '',
      hasSearched: false,
      showIntroScreen: false,
    }
  }
  getChild() {
    return this.refs.submitTicketForm
  }

  render() {
    return <MockWebWidgetGrandchild ref="submitTicketForm" />
  }
}

// SubmitTicketForm/HelpCenterForm
class MockWebWidgetGrandchild extends Component {
  constructor() {
    super()
    this.resetTicketFormVisibility = noop
    this.focusField = noop
  }
  render() {
    return <div />
  }
}
