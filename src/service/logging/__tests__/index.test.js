import Rollbar from 'vendor/rollbar.umd.min.js';
import _ from 'lodash';

jest.mock('utility/devices');

const devices = require('utility/devices');

import { logging, setInitialise } from '../index';

describe('#init', () => {
  const createLogger = (enabled) => logging.init(enabled);

  describe('when getErrorReportingEnabled is false', () => {
    it('does not call init', () => {
      createLogger(false);
      expect(Rollbar.init)
        .not.toHaveBeenCalled();
    });
  });

  describe('when getErrorReportingEnabled is true', () => {
    it('calls init when the browser is not IE', () => {
      devices.isIE = jest.fn(() => false);
      createLogger(true);
      expect(Rollbar.init)
        .toHaveBeenCalled();
    });

    it('does not call init when browser is IE', () => {
      devices.isIE = jest.fn(() => true);
      expect(Rollbar.init)
        .not.toHaveBeenCalled();
    });
  });
});

describe('#error', () => {
  /* eslint no-console:0 */
  const errPayload = {
    error: {
      message: 'error'
    }
  };
  const customData = {
    embedName: 'webWidget',
    configItem: {
      embedName: 'webWidget',
      color: '#e99a27',
      position: 'left',
      visible: false
    }
  };

  beforeEach(() => {
    console.error = jest.fn();
    setInitialise(false); // reset it to initial state
  });

  describe('when environment is in dev mode', () => {
    beforeEach(() => {
      global.__DEV__ = true;

      logging.error(errPayload);
    });

    it('calls console.error in dev environment', () => {
      expect(console.error)
        .toHaveBeenCalledWith(errPayload);
    });
  });

  describe('when environment is not dev mode', () => {
    beforeEach(() => {
      global.__DEV__ = false;
    });

    describe('when special flag is set on error object', () => {
      afterEach(() => {
        _.unset(errPayload, 'error.special');
      });

      it('throws', () => {
        errPayload.error.special = true;

        expect(logging.error.bind(this, errPayload))
          .toThrow();
      });
    });

    describe('when logging service is not initialised', () => {
      beforeEach(() => {
        logging.error(errPayload);
      });

      it('does not call rollbar.error', () => {
        expect(Rollbar.errorSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when logging service is initialised', () => {
      describe('when getErrorReportingEnabled is true', () => {
        beforeEach(() => {
          logging.init(true);
          logging.error(errPayload, customData);
        });

        it('calls Rollbar.error', () => {
          expect(Rollbar.errorSpy)
            .toHaveBeenCalledWith(errPayload, customData);
        });
      });

      describe('when getErrorReportingEnabled is false', () => {
        beforeEach(() => {
          logging.init(false);
          logging.error(errPayload, customData);
        });

        it('does not call Rollbar.error', () => {
          expect(Rollbar.errorSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
