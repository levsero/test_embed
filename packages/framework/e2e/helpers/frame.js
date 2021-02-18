const getByName = (name) => {
  for (const frame of page.mainFrame().childFrames()) {
    if (frame.name() === name) {
      return frame
    }
  }
}

const getDocument = async (name) => {
  const frame = await getByName(name)
  const documentHandle = await frame.evaluateHandle('document')
  return documentHandle.asElement()
}

export default {
  getByName,
  getDocument,
}
