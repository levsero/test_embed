import FormStateRetriever from '../FormStateRetriever'
import * as actions from 'src/embeds/support/actions'
import { Form, Field } from 'react-final-form'
import React from 'react'
import { render } from 'src/util/testHelpers'
import { Provider } from 'react-redux'
import createStore from 'src/redux/createStore'

const renderComponent = (props, rerender) => {
  const combinedProps = {
    testField: 'testInput',
    ...props
  }

  const renderFunc = rerender ? rerender : render

  return renderFunc(
    <Provider store={createStore()}>
      <Form
        onSubmit={() => {}}
        initialValues={combinedProps}
        render={() => (
          <form>
            <FormStateRetriever formName="testForm" />
            <Field
              name="testField"
              render={({ input }) => {
                return (
                  <input
                    type="text"
                    value={input.value}
                    onChange={value => input.onChange(value)}
                    data-testid="theField"
                  />
                )
              }}
            />
          </form>
        )}
      />
    </Provider>
  )
}

describe('FormStateRetriever', () => {
  it('calls setActiveFormState when form data changes', () => {
    const setFormStateSpy = jest.spyOn(actions, 'setFormState')
    const result = renderComponent()
    expect(setFormStateSpy).not.toHaveBeenCalled()

    renderComponent({ testField: 'newValue' }, result.rerender)

    expect(setFormStateSpy).toHaveBeenCalledWith('testForm', { testField: 'newValue' })
  })
})
