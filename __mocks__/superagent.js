let mockDelay;
let mockError;
let mockResponse = {
  status() {
    return 200;
  },
  ok() {
    return true;
  },
  body: {},
  get: jest.fn(),
  toError: jest.fn()
};

const createRequestStub = (obj) => jest.fn(() => obj);
let instances = [];

function Request() {
  let self = this;

  self.mockResponse = mockResponse;
  self.mockDelay = mockDelay;
  self.mockError = mockError;

  self.attach = createRequestStub(self);
  self.on = createRequestStub(self);
  self.responseType = createRequestStub(self);
  self.type = createRequestStub(self);
  self.post = createRequestStub(self);
  self.get = createRequestStub(self);
  self.send = createRequestStub(self);
  self.query = createRequestStub(self);
  self.field = createRequestStub(self);
  self.set = createRequestStub(self);
  self.accept = createRequestStub(self);
  self.timeout = createRequestStub(self);
  self.then = (cb) => {
    return new Promise((resolve, reject) => {
      if (self.mockError) {
        return reject(self.mockError);
      }
      return resolve(cb(self.mockResponse));
    });
  };
  self.end = jest.fn().mockImplementation(function (callback) {
    if (self.mockDelay) {
      this.delayTimer = setTimeout(callback, 0, self.mockError, self.mockResponse);

      return;
    }

    callback(self.mockError, self.mockResponse);
  });
  // expose helper methods for tests to set
  self.__setMockDelay = (boolValue) => {
    self.mockDelay = boolValue;
  },
  self.__setMockResponse = (mockRes) => {
    self.mockResponse = mockRes;
  },
  self.__setMockError = (mockErr) => {
    self.mockError = mockErr;
  };

  instances.push(this);
}

const superagent = jest.fn(function(method, url) {
  // callback
  if (typeof url === 'function') {
    return new Request('GET', method).end(url);
  }

  // url first
  if (arguments.length === 1) {
    return new Request('GET', method);
  }

  return new Request(method, url);
});

superagent.__instances = instances;
superagent.__clearInstances = () => {
  instances = [];
};
superagent.__mostRecent = () => instances[instances.length - 1];

module.exports = superagent;
