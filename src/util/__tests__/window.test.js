import { initResizeMonitor } from '../window';
import { renderer } from 'service/renderer';

jest.mock('service/renderer');

const mockWindow = {
  addEventListener: jest.fn()
};

jest.useFakeTimers();

describe('initResizeMonitor', () => {
  beforeEach(() => {
    initResizeMonitor(mockWindow);
  });

  it('calls addEventListers with the correct params', () => {
    expect(mockWindow.addEventListener)
      .toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('throttles calls to renderer.updateEmbeds for every 10 ms', () => {
    const fn = mockWindow.addEventListener.mock.calls[0][1];

    fn();
    fn();
    jest.runAllTimers();
    expect(renderer.updateEmbeds)
      .toHaveBeenCalledTimes(1);

    fn();
    fn();
    jest.runAllTimers();
    expect(renderer.updateEmbeds)
      .toHaveBeenCalledTimes(2);
  });
});
