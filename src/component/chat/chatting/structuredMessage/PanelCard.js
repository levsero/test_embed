import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { pick } from 'lodash';

import { PanelCard as PurePanelCard } from 'component/shared/StructuredMessage/PanelCard';
import { Button, ButtonSchemaPropType } from './Button';
import { CHAT_STRUCTURED_MESSAGE_ACTION_TYPE } from 'constants/chat';

const { LINK_ACTION } = CHAT_STRUCTURED_MESSAGE_ACTION_TYPE;

const PanelActionPropType = PropTypes.shape({
  type: PropTypes.oneOf([LINK_ACTION]).isRequired,
  value: PropTypes.string.isRequired
});

const PanelPropType = PropTypes.shape({
  heading: PropTypes.string.isRequired,
  paragraph: PropTypes.string,
  image_url: PropTypes.string,
  action: PanelActionPropType
});

export class PanelCard extends Component {
  static propTypes = {
    ...PanelCard.schemaPropTypes,
    createAction: PropTypes.func.isRequired,
  }

  static defaultProps = {
    buttons: []
  }

  static schemaPropTypes = {
    panel: PanelPropType,
    buttons: PropTypes.arrayOf(ButtonSchemaPropType)
  }

  render() {
    const { createAction } = this.props;

    const buttons = this.props.buttons && this.props.buttons.map((button, index) => {
      return <Button {...button} key={index} createAction={createAction} />;
    });

    const panelProp = {
      ...pick(this.props.panel, ['heading', 'paragraph']),
      imageUrl: this.props.panel.image_url,
      onClick: (this.props.panel.action) ? createAction(this.props.panel.action) : null
    };

    return (
      <PurePanelCard panel={panelProp}>
        {buttons}
      </PurePanelCard>
    );
  }
}
