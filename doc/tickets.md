
## Tickets

The Web Widget includes a "Contact us" form that lets users submit their issues as tickets in Support. The form is represented by the `contactForm` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_enduser_leavemsgattatchment_selected.png" width="200">

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

### Settings

The `contactForm` object has the following settings:

* [attachments](./settings#attachments)
* [fields](./settings#fields)
* [selectTicketForm](./settings#selectticketform)
* [subject](./settings#subject)
* [suppress](./settings#suppress)
* [tags](./settings#tags)
* [ticketForms](./settings#ticketforms)
* [title](./settings#title)
