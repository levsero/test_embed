export const setupContainer = (id = 'container') =>
  page.evaluate(id => {
    const div = document.createElement('div')
    div.id = id
    document.querySelector('body').appendChild(div)
  }, id)
