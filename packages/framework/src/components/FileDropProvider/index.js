import PropTypes from 'prop-types'
import { createContext, useState, useContext, useEffect } from 'react'
import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'
import { Container, DropContainer, DropInfo, Message, AttachmentIcon } from './styles'

const DropContext = createContext(() => undefined)

const FileDropProvider = ({ children }) => {
  const translate = useTranslate()
  const [isDragging, setIsDragging] = useState(false)
  const [callback, setCallback] = useState(null)

  const showDropTarget = isDragging && Boolean(callback)

  return (
    <DropContext.Provider value={setCallback}>
      <Container
        onDragEnter={() => {
          setIsDragging(true)
        }}
        data-testid={TEST_IDS.DROP_CONTAINER}
      >
        {showDropTarget && (
          <DropContainer
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)

              if (typeof callback === 'function') {
                callback(e.dataTransfer ? e.dataTransfer.files : e.target.files)
              }
            }}
            onDragLeave={() => {
              setIsDragging(false)
            }}
            onDragOver={(e) => {
              e.preventDefault()
            }}
          >
            <DropInfo>
              <AttachmentIcon />
              <Message>{translate('embeddable_framework.common.attachments.dragdrop')}</Message>
            </DropInfo>
          </DropContainer>
        )}
        {children}
      </Container>
    </DropContext.Provider>
  )
}

FileDropProvider.propTypes = {
  children: PropTypes.node,
}

const useOnDrop = (onDrop) => {
  const setCallback = useContext(DropContext)

  useEffect(() => {
    setCallback(() => onDrop)

    return () => {
      setCallback(null)
    }
  }, [setCallback, onDrop])
}

const FileDropTarget = ({ onDrop }) => {
  useOnDrop(onDrop)

  return null
}

export { FileDropProvider, useOnDrop, FileDropTarget }
