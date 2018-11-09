import tracker from '../tracker';

jest.mock('service/beacon');

import { beacon } from 'service/beacon';

it('does not track if disabled', () => {
  tracker.send = false;
  tracker.track('blah');

  expect(beacon.trackUserAction)
    .not.toHaveBeenCalled();
});

describe('enabled', () => {
  beforeEach(() => {
    tracker.send = true;
  });

  it('skips blacklisted functions', () => {
    tracker.track('webWidget.identify', { x: 1 });

    expect(beacon.trackUserAction)
      .not.toHaveBeenCalled();
  });

  it('sends to beacon with expected arguments', () => {
    tracker.track('webWidget.prefill', { x: 1 });

    expect(beacon.trackUserAction)
      .toHaveBeenCalledWith('api', 'webWidget.prefill', null,
        { args: { x: 1 } }
      );
  });

  it('sends to beacon with array arguments', () => {
    tracker.track('webWidget.prefill', [1, 2]);

    expect(beacon.trackUserAction)
      .toHaveBeenCalledWith('api', 'webWidget.prefill', null,
        { args: [1, 2] }
      );
  });

  it('handles function arguments', () => {
    tracker.track('webWidget.prefill', () => {});

    expect(beacon.trackUserAction)
      .toHaveBeenCalledWith('api', 'webWidget.prefill', null,
        { args: '<callback function>' }
      );
  });

  describe('addTo', () => {
    let subject;

    beforeEach(() => {
      subject = {
        add: (x, y) => x + y
      };
      tracker.addTo(subject, 'test');
    });

    test('function still works', () => {
      expect(subject.add(3, 4))
        .toEqual(7);
    });

    test('tracks the function call', () => {
      subject.add(5, 9);

      expect(beacon.trackUserAction)
        .toHaveBeenCalledWith('api', 'test.add', null,
          { args: [5, 9] }
        );
    });
  });
});
