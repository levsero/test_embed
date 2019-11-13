import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dropdown as GardenDropdown,
  Menu,
  PreviousItem,
  NextItem,
  Item,
  Label,
  Field,
  Select,
  Hint,
  Message
} from '@zendeskgarden/react-dropdowns'
import { getWebWidgetFrameContentWindow } from 'utility/globals'
import ContactFormLabel from 'embeds/support/components/FormField/ContactFormLabel'

const useDropdownTree = (items = []) => {
  const [root, tree, rootId] = useMemo(() => {
    const tree = new Map()

    // Use a symbol as the root id so it has no chance of clashing with a customer
    // defined field
    const rootId = Symbol()

    tree.set(rootId, {
      id: rootId,
      name: '',
      children: []
    })

    items.forEach(item => {
      // Nested fields are defined as parent::child, so split the value into its different parts
      const parts = item.name.split('::')

      parts.forEach((part, index) => {
        const path = parts.slice(0, index + 1)

        // If the current part is the last one, use the fields value as its id, otherwise use its "path".
        // E.g. { name: "one::two::three", value: "cat" }
        // Part "one" -> "one"
        // Part "two" -> "one::two"
        // Part "three" -> "cat"
        const id = index === parts.length - 1 ? item.value : path.join('::')

        const parentId = index > 0 ? parts.slice(0, index).join('::') : rootId

        if (!tree.get(id)) {
          tree.set(id, {
            name: part,
            parent: parentId,
            children: [],
            value: item.value
          })
        }

        // Update the parent's children to include the current node
        const parent = tree.get(parentId)
        if (!parent.children.includes(id)) {
          parent.children.push(id)
        }
      })
    })

    return [tree.get(rootId), tree, rootId]
  }, [items])

  const [view, setView] = useState(root)

  return {
    view,
    open: setView,
    getItem: id => {
      return tree.get(id)
    },
    isRoot: () => {
      return view.id === rootId
    }
  }
}

const Dropdown = ({ field, value, errorMessage, onChange }) => {
  const { view, open, getItem, isRoot } = useDropdownTree(field.custom_field_options)
  const [isOpen, setIsOpen] = useState(false)

  const current = getItem(value) ? getItem(value).name : '-'

  // Use a symbol as the id so it has no chance of clashing with a customer defined field
  const emptyId = Symbol()

  return (
    <div
      role="presentation"
      onKeyDown={e => {
        if (e.key === 'Escape' && isOpen) {
          e.stopPropagation()
        }
      }}
      tabIndex="-1"
    >
      <GardenDropdown
        selectedItem={value}
        isOpen={isOpen}
        downshiftProps={{
          environment: getWebWidgetFrameContentWindow()
        }}
        onStateChange={state => {
          if (state.selectedItem) {
            // When the empty option is clicked
            if (state.selectedItem === emptyId) {
              onChange('')
              setIsOpen(false)
              return
            }

            const item = getItem(state.selectedItem)

            // When an option with children is clicked, open the nested view
            if (item.children.length > 0) {
              open(item)
              return
            }

            // When an "end node" option is clicked
            onChange(item.value)
            setIsOpen(false)
            return
          }

          if (state.isOpen !== undefined) {
            setIsOpen(state.isOpen)
          }
        }}
      >
        <Field>
          {field.title_in_portal && (
            <ContactFormLabel
              value={field.title_in_portal}
              as={Label}
              required={field.required_in_portal}
            />
          )}

          {field.description && <Hint>{field.description}</Hint>}

          {errorMessage && <Message validation="error">{errorMessage}</Message>}

          <Select>{current}</Select>
        </Field>
        <Menu>
          {view.parent && <PreviousItem value={view.parent}>{view.name}</PreviousItem>}

          {Boolean(isRoot() && !field.required_in_portal) && <Item value={emptyId}>-</Item>}

          {view.children.map(itemId => {
            const item = getItem(itemId)

            if (!item) {
              return null
            }

            if (item.children.length > 0) {
              return (
                <NextItem value={itemId} key={itemId.toString()}>
                  {item.name}
                </NextItem>
              )
            }

            return (
              <Item value={itemId} key={itemId.toString()}>
                {item.name}
              </Item>
            )
          })}
        </Menu>
      </GardenDropdown>
    </div>
  )
}

Dropdown.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title_in_portal: PropTypes.string,
    description: PropTypes.string,
    required_in_portal: PropTypes.bool,
    custom_field_options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  errorMessage: PropTypes.string
}

export default Dropdown
