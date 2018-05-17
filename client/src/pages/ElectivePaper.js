import React, { Component } from 'react';

export default class ElectivePaper extends Component {
  render() {
    const { name, sku, level } = this.props;
    return (
      <div>
        <div>{`${sku} ${name} (Level ${level})`}</div>
      </div>
    );
  }
}
