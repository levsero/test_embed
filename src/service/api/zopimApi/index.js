import {
  setupZopimQueue,
  handleZopimQueue
} from './queues';
import { setUpZopimApiMethods } from './setup';

const zopimApi = {
  setupZopimQueue,
  handleZopimQueue,
  setUpZopimApiMethods
};

export default zopimApi;
