// These presets can be used when creating a mock embeddable config with the createEmbeddableConfig function
const presets = {
  helpCenter: {
    embeds: {
      helpCenterForm: {
        embed: 'helpCenter',
        props: {
          color: '#1F73B7',
          contextualHelpEnabled: false
        }
      }
    }
  },
  contactForm: {
    embeds: {
      ticketSubmissionForm: {
        props: {
          attachmentsEnabled: true,
          nameFieldEnabled: false,
          nameFieldRequired: false,
          color: '#1F73B7',
          maxFileSize: 20971520
        }
      }
    }
  },
  zopimChat: {
    embeds: {
      zopimChat: {
        embed: 'chat',
        props: {
          color: '#1F73B7',
          zopimId: 'P6xCvZrbOWtNh1gArZXCkD0q0MnIvAfA'
        }
      }
    }
  }
}

export default presets
