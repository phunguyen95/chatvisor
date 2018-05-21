import React, { Component } from 'react';

export default class CorequisitesPaper extends Component {
  render() {
    const { corequisites } = this.props;

    return (
      <div>
        {corequisites.length > 0
          ? corequisites.map(item => <div>{item}</div>)
          : 'This paper does not require co-requisites papeprs'}
      </div>
    );
  }
}
