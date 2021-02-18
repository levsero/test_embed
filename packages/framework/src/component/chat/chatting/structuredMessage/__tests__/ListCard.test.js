import { render } from '@testing-library/react'
import React from 'react'

import { ListCard } from '../ListCard'

const renderListCard = (items = [], buttons = [], createAction = jest.fn()) => {
  return render(<ListCard buttons={buttons} items={items} createAction={createAction} />)
}

describe('render', () => {
  const items = [
    {
      heading: 'Nsync',
      paragraph: 'Before they sold out High Life. Umami tattooed sriracha.',
      image_url: 'https://nsync.com/banner.png',
      action: {
        type: 'LINK_ACTION',
        value: 'https://nsync.com',
      },
    },
    {
      heading: "Destiny's Child",
      paragraph: 'Trust fund artisan master cleanse Etsy direct trade rye.',
      image_url: 'https://destiny.com/banner.png',
      action: {
        type: 'LINK_ACTION',
        value: 'https://destiny.com',
      },
    },
  ]

  it('renders the list correctly', () => {
    const result = renderListCard(items)

    expect(result.container).toMatchSnapshot()
  })

  it('heading line clamp should be 1', () => {
    const { getByText } = renderListCard(items)

    expect(getByText('Nsync').style.WebkitLineClamp).toEqual('1')
  })
})
