import React, { Component } from 'react';

export default class SuggestSetStudyPlan extends Component {
    render() {
        const {list} = this.props;
        return (
            <div>
                {list.length>0?list.map(item=>
                <p>{item.name}</p>):null}
            </div>
        )
    }
  render() {
    const { list, major, currentYear } = this.props;

    return (
      <div>
        Here is the suggested list of papers for {major} in Year {currentYear}:
        {list.length > 0 ? list.map(item => <p>{item.name}</p>) : null}
      </div>
    );
  }
}
