import React, { Component } from 'react';

export default class PrerequisitesPaper extends Component {
  render() {
    const { prerequisites, name } = this.props;

    return (
      <div>
        <div>
          The prerequisites of {name} is: 
          {prerequisites.length > 0
            ? prerequisites.map(item => <div key={item}>{item}</div>)
            : `${name} does not require any prerequisites.`}
        </div>
      </div>
    );
  }
}
