export const mockFrameMethods = {
  show: jasmine.createSpy('mockFrameShow'),
  hide: jasmine.createSpy('mockFrameHide'),
  expand: jasmine.createSpy('mockFrameExpand'),
  setHighlightColor: jasmine.createSpy('setHighlightColor'),
  setButtonColor: jasmine.createSpy('setButtonColor'),
  reRenderCloseButton: jasmine.createSpy('mockReRenderCloseButton'),
  componentDidUpdate: jasmine.createSpy('mockComponentDidUpdate'),
  updateFrameSize: jasmine.createSpy('updateFrameSize')
};

class MockEmbedWrapper extends React.Component {
  setHighlightColor() {
    this.setState({
      css: 'setHighlightColorCSS { background-color: red; }'
    });
  }

  showBackButton() {
    this.setState({ showBackButton: true });
  }

  render() {
    const newChild = React.cloneElement(this.props.children, {
      ref: 'rootComponent'
    });

    return (<div>{newChild}</div>);
  }
}

export class MockFrame extends Component {
  constructor() {
    super();
    this.show = mockFrameMethods.show;
    this.hide = mockFrameMethods.hide;
    this.expand = mockFrameMethods.expand;
    this.setHighlightColor = mockFrameMethods.setHighlightColor;
    this.setButtonColor = mockFrameMethods.setButtonColor;
    this.updateFrameSize = mockFrameMethods.updateFrameSize;
    this.componentDidUpdate = mockFrameMethods.componentDidUpdate;
  }

  componentDidMount = () => {
    this.renderFrameContent();
  }

  getChild() {
    return this.child;
  }

  getRootComponent() {
    return this.child.refs.rootComponent;
  }

  renderFrameContent = () => {
    const iframe = ReactDOM.findDOMNode(this);
    const doc = iframe.contentWindow.document;
    const element = doc.body.appendChild(doc.createElement('div'));

    this.child = ReactDOM.render(
      <MockEmbedWrapper className='mock-frame'>{this.props.children}</MockEmbedWrapper>,
      element
    );
  }

  render = () => {
    return (
      <iframe ref='frame' className='mock-frame' />
    );
  }
}

