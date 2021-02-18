import React, { useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Dropdown as GardenDropdown,
  Menu,
  PreviousItem,
  NextItem,
  Item,
  Label,
  Field,
  Hint,
  Message,
} from '@zendeskgarden/react-dropdowns'
import ContactFormLabel from 'src/components/DynamicForm/FormField/ContactFormLabel'
import { useCurrentFrame } from 'src/framework/components/Frame'
import { TEST_IDS } from 'constants/shared'
import { DropdownSelect } from './styles'
import { withTheme } from 'styled-components'

const useDropdownTree = (items = []) => {
  // Use a symbol as the root id so it has no chance of clashing with a customer
  // defined field
  const { current: rootId } = useRef(Symbol())

  const tree = useMemo(() => {
    const tree = new Map()

    tree.set(rootId, {
      id: rootId,
      name: '',
      children: [],
    })

    items.forEach((item) => {
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
            value: item.value,
            disabled: item.disabled,
          })
        }

        // Update the parent's children to include the current node
        const parent = tree.get(parentId)
        if (!parent.children.includes(id)) {
          parent.children.push(id)
        }
      })
    })

    return tree
  }, [items])

  const [currentViewId, setViewId] = useState(rootId)

  return {
    view: tree.get(currentViewId),
    open: setViewId,
    getItem: (id) => {
      return tree.get(id)
    },
    isRoot: () => {
      return currentViewId === rootId
    },
  }
}

const Dropdown = ({
  field,
  value,
  errorMessage,
  errorMessageKey,
  onChange,
  theme,
  isReadOnly,
  isPreview,
}) => {
  const { view, open, getItem, isRoot } = useDropdownTree(field.options)
  const [isOpen, setIsOpen] = useState(false)
  const frame = useCurrentFrame()

  const current = getItem(value) ? getItem(value).name : '-'

  // Use a symbol as the id so it has no chance of clashing with a customer defined field
  const emptyId = Symbol()

  return (
    <div
      role="presentation"
      onKeyDown={(e) => {
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
          environment: frame.window,
        }}
        onStateChange={(state) => {
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
              open(state.selectedItem)
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
          {field.title && (
            <ContactFormLabel
              fieldId={field.id}
              value={field.title}
              as={Label}
              required={field.required}
              isReadOnly={isReadOnly}
              isPreview={isPreview}
            />
          )}

          {field.description && <Hint>{field.description}</Hint>}

          <DropdownSelect
            data-testid={TEST_IDS.DROPDOWN_FIELD}
            name={field.id}
            validation={errorMessage ? 'error' : undefined}
          >
            {current}
          </DropdownSelect>

          {errorMessage && (
            <Message validation="error" key={errorMessageKey}>
              {errorMessage}
            </Message>
          )}
        </Field>
        <Menu data-testid={TEST_IDS.DROPDOWN_OPTIONS} maxHeight={`${240 / theme.fontSize}rem`}>
          {view.parent && <PreviousItem value={view.parent}>{view.name}</PreviousItem>}

          {Boolean(isRoot() && !field.required) && <Item value={emptyId}>-</Item>}

          {view.children.map((itemId) => {
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
              <Item
                value={itemId}
                key={itemId.toString()}
                disabled={item.disabled}
                data-testid={TEST_IDS.DROPDOWN_OPTION}
              >
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
    title: PropTypes.string,
    description: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
      })
    ),
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number,
  theme: PropTypes.shape({
    fontSize: PropTypes.number,
  }),
  isReadOnly: PropTypes.bool,
  isPreview: PropTypes.bool,
}

export default withTheme(Dropdown)
