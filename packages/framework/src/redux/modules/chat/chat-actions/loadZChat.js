/*
 * This file just returns zChat as is, but can be overridden
 * (using webpack) to return a different version. As an example,
 * E2E tests load a different version (see loadZChat.e2e.js)
 */
const loadZChat = m => m

export default loadZChat
