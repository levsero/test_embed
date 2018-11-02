import { render } from 'react-testing-library';
import React from 'react';

import { ChatHeader } from '../ChatHeader';

it('renders the avatar', () => {
  const { container } = render(<ChatHeader
    concierges={[
      {
        avatar: 'https://example.com/snake',
        display_name: 'Luke Skywalker',
        title: 'Jedi Knight'
      }
    ]}
  />);

  expect(container.querySelector('.Icon--avatar'))
    .toBeInTheDocument();
});

it('renders the agent name and title', () => {
  const { queryByText } = render(<ChatHeader
    concierges={[
      {
        avatar: 'https://example.com/snake',
        display_name: 'Luke Skywalker',
        title: 'Jedi Knight'
      }
    ]}
  />);

  expect(queryByText('Jedi Knight'))
    .toBeInTheDocument();
  expect(queryByText('Luke Skywalker'))
    .toBeInTheDocument();
});

it('renders the default concierge name and title', () => {
  const { queryByText } = render(<ChatHeader
    concierges={[
      {
        avatar: 'https://example.com/snake'
      }
    ]}
  />);

  expect(queryByText('Live Support'))
    .toBeInTheDocument();
  expect(queryByText('Customer Support'))
    .toBeInTheDocument();
});

describe('showRating', () => {
  it('shows rating buttons when it is true', () => {
    const { container } = render(<ChatHeader
      showRating={true}
    />);

    expect(container.querySelector('.Icon--thumbUp'))
      .toBeInTheDocument();
    expect(container.querySelector('.Icon--thumbDown'))
      .toBeInTheDocument();
  });

  it('does not show rating buttons when it is false', () => {
    const { container } = render(<ChatHeader
      showRating={false}
    />);

    expect(container.querySelector('.Icon--thumbUp'))
      .not.toBeInTheDocument();
    expect(container.querySelector('.Icon--thumbDown'))
      .not.toBeInTheDocument();
  });
});

describe('showTitle', () => {
  it('does not render the agent name and title if it is false', () => {
    const { queryByText } = render(<ChatHeader
      concierges={[
        {
          avatar: 'https://example.com/snake',
          display_name: 'Luke Skywalker',
          title: 'Jedi Knight'
        }
      ]}
      showTitle={false}
    />);

    expect(queryByText('Jedi Knight'))
      .not.toBeInTheDocument();
    expect(queryByText('Luke Skywalker'))
      .not.toBeInTheDocument();
  });
});

describe('showAvatar', () => {
  it('does not render the avatar if it is false', () => {
    const { container } = render(<ChatHeader
      concierges={[
        {
          avatar: 'https://example.com/snake',
          display_name: 'Luke Skywalker',
          title: 'Jedi Knight'
        }
      ]}
      showAvatar={false}
    />);

    expect(container.querySelector('.Icon--avatar'))
      .not.toBeInTheDocument();
  });
});
