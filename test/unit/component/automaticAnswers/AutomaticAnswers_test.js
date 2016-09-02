describe('AutomaticAnswers component', () => {
  let AutomaticAnswers,
    automaticAnswers;
  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswers');

  beforeEach(() => {
    AutomaticAnswers = requireUncached(automaticAnswersPath).AutomaticAnswers;
  });

  describe('instantiation', () => {
    beforeEach(() => {
      automaticAnswers = instanceRender(<AutomaticAnswers />);
    });

    it('sets initial ticket state', () => {
      expect(automaticAnswers.state.ticket.title)
        .toEqual('');
      expect(automaticAnswers.state.ticket.niceId)
        .toEqual(null);
      expect(automaticAnswers.state.ticket.statusId)
        .toEqual(null);
    });
  });

  describe('updateTicket', () => {
    const mockTicket = {
      'nice_id': 13490587,
      'status_id': 2,
      'title': "Most orchestras are just 1800's cover bands."
    };

    beforeEach(() => {
      automaticAnswers = instanceRender(<AutomaticAnswers />);
      automaticAnswers.updateTicket(mockTicket);
    });

    it('updates ticket state', () => {
      expect(automaticAnswers.state.ticket.title)
        .toEqual(mockTicket.title);
      expect(automaticAnswers.state.ticket.niceId)
        .toEqual(mockTicket.nice_id);
      expect(automaticAnswers.state.ticket.statusId)
        .toEqual(mockTicket.status_id);
    });
  });
});
