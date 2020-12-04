class Response {
  constructor(response) {
    this.body = response.body
    this.status = response.status
    this.headers = response.headers
    this.type = response.type
    this._raw = response
  }
}

export default Response
