module.exports = `{
  banner: {
    enabled: true,
    layout: 'image_right',
    text: null,
    image_path: '',
    image_data: ''
  },
  behavior: {
    do_not_display: false
  },
  bubble: {
    enabled: true,
    title: null,
    text: null
  },
  chat_button: {
    hide_when_offline: false
  },
  chat_window: {
    mobile_mode: 'overlay',
    title_bar: {
      title: null,
      status_messages: {
        online: null,
        away: null,
        offline: null
      }
    }
  },
  concierge: {
    display_name: 'Hello',
    title: 'World',
    avatar_path: 'https://v2assets.zopim.io/2EkTn0An31opxOLXuGgRCy5nPnSNmpe6-concierge?1502429123654',
    avatar_data: '',
    greeting: {
      enabled: false,
      message: null
    }
  },
  file_sending: {
    enabled: true,
    allowed_extensions: 'png,jpg,jpeg,gif,txt,pdf'
  },
  forms: {
    pre_chat_form: {
      required: true,
      profile_required: false,
      message: 'test',
      form: {
        '0': {
          name: 'name',
          required: false
        },
        '1': {
          name: 'email',
          required: false
        },
        '2': {
          label: 'Department',
          name: 'department',
          required: false,
          type: 'department'
        },
        '3': {
          label: null,
          name: 'message',
          required: false,
          type: 'textarea'
        },
        '4': {
          label: null,
          name: 'phone',
          required: false,
          type: 'text',
          hidden: true
        }
      }
    },
    offline_form: {
      message: null,
      message_disabled: null,
      post_submit_message: null,
      profile_required: true,
      form: {
        '0': {
          name: 'name',
          required: 1
        },
        '1': {
          name: 'email',
          required: 1
        },
        '2': {
          label: null,
          name: 'message',
          required: 1,
          type: 'textarea'
        },
        '3': {
          label: null,
          name: 'phone',
          required: false,
          type: 'text',
          hidden: true
        }
      },
      channels: {
        twitter: {
          allowed: false,
          page_id: ''
        },
        facebook: {
          allowed: false,
          page_id: ''
        }
      }
    },
    post_chat_form: {
      header: null,
      message: null,
      comments_enabled: true,
      comments_messages: {
        good: {
          message: null,
          placeholder: null
        },
        bad: {
          message: null,
          placeholder: null
        }
      }
    }
  },
  greetings: {
    online: null,
    offline: null
  },
  language: {
    language: null
  },
  login: {
    allowed_types: {
      email: true,
      facebook: false,
      twitter: false,
      google: false
    },
    phone_display: false,
    restrict_profile: false
  },
  rating: {
    enabled: true
  },
  sound: {
    disabled: true
  },
  theme: {
    name: 'simple',
    message_type: 'bubble_avatar',
    colors: {
      placeholder: '_',
      bubble: '#e59341',
      banner: '#eeeeee',
      primary: '#555555'
    },
    chat_button: {
      position: 'br',
      position_mobile: 'br'
    },
    chat_window: {
      position: 'br',
      size: 'medium',
      profile_card: {
        display_avatar: true,
        display_rating: true,
        display_title_name: true
      },
      use_banner: true,
      title_bar: {
        hide_minimize: false,
        hide_popout: false
      }
    },
    branding: {
      type: 'icon_font_zopim'
    }
  },
  timezone: 'Australia/Melbourne',
  operating_hours: {
    display_notice: true
  }
}`;
