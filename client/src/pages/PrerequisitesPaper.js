import React, { Component } from 'react';

export default class PrerequisitesPaper extends Component {
  render() {
    const { prerequisites } = this.props;

    return (
      <div>
        <div>
          {prerequisites.length > 0
            ? prerequisites.map(item=><div key={item}>Hi,{item}</div>)
            : 'This paper does not require prerequisites papeprs'}
        </div>
      </div>
    );
  }
}
 