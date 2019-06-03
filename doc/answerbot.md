## Answer Bot API

The Web Widget includes Answer Bot, a virtual customer assistant that uses machine learing to answer customer questions before they are directed to a chat agent, initiate a callback, or leave a message. It provides article suggestions from your Help Center. The Answer Bot component is represented by the answerBot key of the webWidget object, and is itself an object.

For more information about Answer Bot, please see our [help center article](https://support.zendesk.com/hc/en-us/articles/230808087-Answer-Bot-resources).
### Settings

The `answerBot` object has the following settings:

* [suppress](./settings#suppress)
* [title](./settings#title)
* [contactOnlyAfterQuery](./settings#contactonlyafterquery)
* [search](./settings#search)
* [avatar](./settings#avatar)
* [contactOptions](./core#contactoptions)

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
          '*': 'The Last Bot Bender'
        }
      }
    }
  }
};
</script>
```