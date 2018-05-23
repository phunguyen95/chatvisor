import React, { Component } from 'react';

export default class FollowingPapers extends Component {
  render() {
    const { following, name } = this.props;
    return (
      <div>
        <p>
          {following.length > 0
            ? `The suggested paper after completing ${name} is:`
            : `There are no following papers for ${name}`}
        </p>
        <div>
          {following
            ? following.map(item => <div key={item}>{item}</div>)
            : null}
        </div>
      </div>
    );
  }
}
