import React, { Component } from 'react';

export default class ElectivePaper extends Component {
  render() {
    const { name, sku } = this.props;
    console.log('vo day');
    return (
      <div>
        <div>{`${sku} ${name}`}</div>
      </div>
    );
  }
}
