const injectModule = async (url, webpackModuleName, scope) => {
  await new Promise((resolve, reject) => {
    const element = document.createElement('script')

    element.src = url
    element.type = 'text/javascript'
    element.async = true

    element.onload = () => {
      element.parentElement.removeChild(element)
      resolve()
    }
    element.onerror = (error) => {
      element.parentElement.removeChild(element)
      reject(error)
    }

    document.head.appendChild(element)
  })

  const container = await window[webpackModuleName]

  const factory = await container.get(scope)

  return factory()
}

export default injectModule
