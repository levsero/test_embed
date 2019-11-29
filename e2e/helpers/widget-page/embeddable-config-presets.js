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
  chat: {
    embeds: {
      zopimChat: {
        embed: 'chat',
        props: {
          color: '#1F73B7',
          zopimId: 'P6xCvZrbOWtNh1gArZXCkD0q0MnIvAfA'
        }
      }
    }
  },
  helpCenterWithContextualHelp: helpCenterEmbed({ contextualHelpEnabled: true })
}

export default presets
