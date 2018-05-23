import React, { Component } from 'react'

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
}
