import { hostWithPort } from 'e2e/env'

const events = [
  { type: 'account_status', detail: 'online' },
  { type: 'visitor_update', detail: { email: '', display_name: 'Visitor 85153315' } },
  { type: 'connection_update', detail: 'connected' },
  { type: 'department_update', detail: { status: 'online', id: 1, name: 'Dept 1' } },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325772386,
      nick: 'visitor',
      type: 'chat.memberjoin',
      display_name: 'Visitor 1525325771'
    }
  },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325926444,
      nick: 'visitor',
      type: 'chat.msg',
      display_name: 'Visitor 1525325926',
      msg: 'hey there'
    }
  },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325936518,
      nick: 'agent:1689357',
      type: 'chat.memberjoin',
      display_name: 'Briana Coppard'
    }
  },
  {
    type: 'chat',
    detail: {
      timestamp: 1525325939026,
      nick: 'agent:1689357',
      type: 'chat.msg',
      display_name: 'Briana Coppard',
      msg: 'hey to you too'
    }
  },
  {
    type: 'agent_update',
    detail: {
      avatar_path: `http://${hostWithPort}/e2e/fixtures/files/avatar.png`,
      display_name: 'Briana Coppard',
      title: 'Customer Service',
      nick: 'agent:1689357'
    }
  }
]

export default events
