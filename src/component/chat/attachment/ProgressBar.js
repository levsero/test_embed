import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './ProgressBar.scss'
import classNames from 'classnames'
import { TEST_IDS } from 'src/constants/shared'

export class ProgressBar extends Component {
  static propTypes = {
    percentLoaded: PropTypes.number,
    fakeProgress: PropTypes.bool
  }

  static defaultProps = {
    percentLoaded: 0
  }

  render() {
    const progressBarClasses = classNames(styles.progressBar, {
      [styles.fakeProgressAnimation]: this.props.fakeProgress
    })

    return (
      <div className={styles.container}>
        <div
          className={progressBarClasses}
          style={{ width: `${Math.floor(this.props.percentLoaded)}%` }}
          data-testid={TEST_IDS.PROGRESS_BAR}
        />
      </div>
    )
  }
}
