export default class Node {
  constructor(name='', value = '', parent=null) {
    this.name = name;
    this.value = value;

    this.childrenNodes = {};
    this.orderedChildren = [];
    this.parentNode = parent;
  }

  getChildNode(name) {
    return this.childrenNodes[name];
  }

  hasChildren() {
    return this.orderedChildren.length > 0;
  }

  addChildNode(name, value) {
    const childNode = new Node(name, value, this);

    this.childrenNodes[name] = childNode;
    this.orderedChildren.push(name);
  }
}
