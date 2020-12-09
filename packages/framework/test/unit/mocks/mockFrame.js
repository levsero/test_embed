class MockEmbedWrapper extends Component {
  setHighlightColor() {
    this.setState({
      css: 'setHighlightColorCSS { background-color: red; }'
    })
  }

  showBackButton() {
    this.setState({ showBackButton: true })
  }

  render() {
    const newChild = React.cloneElement(this.props.children, {
      ref: 'rootComponent'
    })

    return <div>{newChild}</div>
  }
}

export class MockFrame extends Component {
  constructor() {
    super()
    this.show = noop
    this.hide = noop
    this.setHighlightColor = noop
    this.forceUpdateWorld = noop
    this.componentDidUpdate = noop

    this.state = {}
  }

  componentDidMount = () => {
    this.renderFrameContent()
  }

  getChild() {
    return this.child
  }

  getRootComponent() {
    return this.child.refs.rootComponent
  }

  renderFrameContent = () => {
    const iframe = ReactDOM.findDOMNode(this)
    const doc = iframe.contentWindow.document
    const element = doc.body.appendChild(doc.createElement('div'))

    ReactDOM.render(
      <MockEmbedWrapper
        ref={el => {
          this.child = el
        }}
        className="mock-frame"
      >
        {this.props.children}
      </MockEmbedWrapper>,
      element
    )
  }

  render = () => {
    return <iframe title="mockFrame" ref="frame" className="mock-frame" />
  }
}