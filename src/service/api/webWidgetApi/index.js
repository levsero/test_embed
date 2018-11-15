import {
  apisExecuteQueue,
  apisExecutePostRenderQueue,
  setupLegacyApiQueue
} from './queues';
import {
  legacyApiSetup,
  apiSetup
} from './setupLegacyApi';

const webWidgetApi = {
  apisExecuteQueue,
  apisExecutePostRenderQueue,
  legacyApiSetup,
  setupLegacyApiQueue,
  apiSetup
};

export default webWidgetApi;
