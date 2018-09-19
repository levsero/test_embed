## Talk

The Web Widget includes a Talk component that lets users talk to an agent. The component is represented by the `talk` object of `webWidget`.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/widget_talk_callback%2520form.png" width="200">


### Settings

The `talk` object has the following setting:

* [nickname](./settings#nickname)

<a name="example-talk-settings"></a>
#### Example

```html
<script type="text/javascript">
window.zESettings = {
  webWidget: {
    talk: {
      nickname: 'Sales Support'
    }
  }
};
</script>
```
