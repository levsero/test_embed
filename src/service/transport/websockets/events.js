const socketTalkEmbeddableConfigEvent = 'socket.embeddableConfig';

export function talkEmbedableConfigEventToAction(socket, reduxStore) {
  socket.on(socketTalkEmbeddableConfigEvent, (embeddableConfig) => {
    const actionType = `talk/${socketTalkEmbeddableConfigEvent}`;

    reduxStore.dispatch({ type: actionType, payload: embeddableConfig });
  });
}
