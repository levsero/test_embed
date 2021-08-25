import * as httpRequest from 'superagent'
import Response from '../http/Response'

const isEmpty = (object) => Object.entries(object).length === 0

class Request {
  constructor({ method = 'GET', url = '', data = {}, params = {}, headers = {} }) {
    this._request = httpRequest(method, url)
    this._response = null

    this._request.set(headers)
    if (!isEmpty(data) || typeof data?.values === 'function') {
      this._request.send(data)
    }
    if (!isEmpty(params)) this._request.query(params)
  }

  response() {
    if (this._response) return this._response
    return this._request.then((response) => {
      this._response = new Response(response)
      return this._response
    })
  }

  then() {
    return this.response()
  }
}

export default Request
