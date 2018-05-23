import React, { Component } from 'react';

export default class ElectivePaper extends Component {
  render() {
    const { name, sku, level, major } = this.props;
    return (
      <div>
        <div>{`${sku} ${name} (Level ${level})`}</div>
      </div>
    );
  }
}
