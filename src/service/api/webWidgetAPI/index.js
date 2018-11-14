
import {
  apisExecuteQueue,
  apisExecutePostRenderQueue,
  legacyApiSetupQueue
} from './queues';
import {
  legacyApiSetup,
  apiSetup
} from './setup';

const webWidgetApi = {
  apisExecuteQueue,
  apisExecutePostRenderQueue,
  legacyApiSetup,
  legacyApiSetupQueue,
  apiSetup
};

export default webWidgetApi;
