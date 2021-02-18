import { getFormValues } from 'src/redux/modules/form/selectors'

describe('form selectors', () => {
  describe('getFormValues', () => {
    it('returns the last prefill id the form has respected', () => {
      const state = {
        form: {
          formValues: {
            123: {
              name: 'Something',
            },
          },
        },
      }

      expect(getFormValues(state, 123)).toEqual({
        name: 'Something',
      })
    })

    it('returns nothing if there is no data for the given form id', () => {
      const state = {
        form: {
          formValues: {
            123: {
              name: 'Something',
            },
          },
        },
      }

      expect(getFormValues(state, 100)).toBe(undefined)
    })
  })
})
