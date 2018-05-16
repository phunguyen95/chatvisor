import React, { Component } from 'react';
import ElectivePaper from './ElectivePaper';
import PrerequisitesPaper from './PrerequisitesPaper';
import './css/Message.css';
export default class Messages extends Component {
  showElectivePapers = list => {
    let result = null;
    result = list.electivePapers.map((item, order) => {
      console.log(item);
      return <ElectivePaper name={item.name} sku={item.sku} />;
    });
    return result;
  };
  showPrerequisitesPapers = (list, paperGiven) => {
    let result = null;
    console.log(list);
    console.log(paperGiven)
    result = list.corePapers.map((item, order) => {
      console.log(item.name);
      if (item.name === paperGiven)
        return <PrerequisitesPaper prerequisites={item.prerequisites} />;
    });
    return result;
  };
  // showListPapers=(list)=>{
  //   let result = null;
  //   result= list.map(item=>)
  // }
  renderAction = (list, paperGiven, actionGiven) => {
    console.log(actionGiven);
    if (actionGiven === 'prerequisites') {
      return this.showPrerequisitesPapers(list, paperGiven);
    } else if (actionGiven === 'elective') {
      return this.showElectivePapers(list);
    }
    // else if(actionGiven===''){

    //   return this.showListPapers(list);
    // }
  };
  render() {
    const { messages } = this.props;
    return (
      <div className="thread-container">
        <div className="thread">
          <div className="message-received">
            <div className="wrapped-text-body">
              <div className="message-header">
                <div className="text-header">BOT</div>
              </div>
              <div class="text-body-received">
                Welcome to chatbot AUT,please let me know if you need any help
              </div>
            </div>
          </div>
          {messages.length > 0
            ? messages.map((mes, index) => (
                <div
                  key={index}
                  className={`message-container 
                'right'}`}
                >
                  <div className="data">
                    <div className="message-sender">
                      <div className="wrapped-text-body">
                        <div className="message-header">
                          <div className="text-header">User</div>
                        </div>
                        <div class="text-body-sender">{mes.userSent}</div>
                      </div>
                    </div>
                    <div className="message-received">
                      <div class="text-body-received">
                        {mes.foundResults ? (
                          <div>
                            {this.renderAction(
                              mes.foundResults,
                              mes.paperGiven,
                              mes.actionGiven
                            )}
                          </div>
                        ) : (
                          <div>{`${mes.message}`}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    );
  }
}
