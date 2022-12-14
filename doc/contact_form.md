## Contact Form API

The Web Widget includes a "Contact us" form that lets users submit their issues as tickets in Support. The form is represented by the `contactForm` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/web-widget/contactForm.png" alt="Contact Form Component Example" width="250px">

### Settings

The `contactForm` object has the following settings:

- [attachments](./settings#attachments)
- [fields](./settings#fields)
- [selectTicketForm](./settings#selectticketform)
- [subject](./settings#subject)
- [suppress](./settings#suppress)
- [ticketForms](./settings#ticketforms)
- [title](./settings#title)

<a name="example-contact-form"></a>

### Example

```html
<script type="text/javascript">
  window.zESettings = {
    webWidget: {
      contactForm: {
        attachments: true
      }
    }
  };
</script>
```
