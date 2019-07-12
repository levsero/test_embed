## Answer Bot API

The Web Widget includes Answer Bot, a virtual customer assistant that uses machine learning to answer customer questions before they are directed to a chat agent, initiate a callback, or leave a message. It provides article suggestions from your Help Center. The Answer Bot component is represented by the answerBot key of the webWidget object, and is itself an object.

For more information about Answer Bot in the Web Widget, see [Enabling and using Answer Bot in the Web Widget](https://support.zendesk.com/hc/en-us/articles/360024050373).

### Settings

The `answerBot` object has the following settings:

- [avatar](./settings#avatar)
- [contactOnlyAfterQuery](./settings#contactonlyafterquery)
- [contactOptions](./core#contactoptions)
- [search](./settings#search)
- [suppress](./settings#suppress)
- [title](./settings#title)

<a name="example-answerbot-settings"></a>

#### Example

```html
<script type="text/javascript">
  window.zESettings = {
    webWidget: {
      answerBot: {
        suppress: false,
        title: {
          '*': 'Chat with us!'
        },
        contactOnlyAfterQuery: true,
        search: {
          labels: ['I would like help.']
        },
        avatar: {
          url: 'https://youravatarurl.com/image.png',
          name: {
            '*': 'Company logo'
          }
        }
      }
    }
  }
</script>
```
