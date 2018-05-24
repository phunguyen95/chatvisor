import React, { Component } from 'react';

export default class ElectivePaper extends Component {
  render() {
    const { list, major } = this.props;
    return (
      <div>
        <p>The list of electives available for {major} are:</p>
       {list.electivePapers.length > 0 ? list.electivePapers.map((item,index)=>{
            return <p>{item.sku} {item.name} ({item.level})</p>
       }):null}
      </div>
    );
  }
}
