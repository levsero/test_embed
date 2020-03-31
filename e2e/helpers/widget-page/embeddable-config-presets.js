const chatEmbed = (props = {}) => ({
  embeds: {
    chat: {
      embed: 'chat',
      props: {
        color: '#1F73B7',
        zopimId: 'P6xCvZrbOWtNh1gArZXCkD0q0MnIvAfA',
        ...props
      }
    }
  }
})

const helpCenterEmbed = (props = {}) => ({
  embeds: {
    helpCenterForm: {
      embed: 'helpCenter',
      props: {
        color: '#1F73B7',
        contextualHelpEnabled: false,
        ...props
      }
    }
  }
})

// These presets can be used when creating a mock embeddable config with the createEmbeddableConfig function
const presets = {
  helpCenter: helpCenterEmbed(),
  contactForm: {
    embeds: {
      ticketSubmissionForm: {
        props: {
          attachmentsEnabled: true,
          nameFieldEnabled: true,
          nameFieldRequired: false,
          color: '#1F73B7',
          maxFileSize: 20971520
        }
      }
    }
  },
  chat: chatEmbed(),
  chatStandalone: chatEmbed({
    standalone: true,
    badge: {
      color: '#e9ebed',
      enabled: true,
      imagePath: '',
      layout: 'image_right',
      text: 'Chat with us'
    }
  }),
  chatWithChatBadge: chatEmbed({
    badge: {
      color: '#e9ebed',
      enabled: true,
      imagePath: '',
      layout: 'image_right',
      text: 'Chat with us'
    }
  }),
  helpCenterWithContextualHelp: helpCenterEmbed({ contextualHelpEnabled: true }),
  answerBot: helpCenterEmbed({ answerBotEnabled: true }),
  answerBotWithContextualHelp: helpCenterEmbed({
    contextualHelpEnabled: true,
    answerBotEnabled: true
  })
}

export default presets
