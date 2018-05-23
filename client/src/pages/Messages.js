import React, { Component } from 'react';
import ElectivePaper from './ElectivePaper';
import PrerequisitesPaper from './PrerequisitesPaper';
import CorequisitesPaper from './CorequisitesPaper';
import SuggestSetStudyPlan from './SuggestSetStudyPlan';
import FollowingPapers from './FollowingPapers';
import './css/Message.css';
export default class Messages extends Component {
  showElectivePapers = list => {
    let result = null;
    result = list.electivePapers.map((item, order) => {
      return (
        <ElectivePaper name={item.name} sku={item.sku} level={item.level} />
      );
    });
    return result;
  };
  showPrerequisitesPapers = (list, paperGiven) => {
    let result = null;
    console.log(list);
    result = list.map((item, order) => {
      return (
        <PrerequisitesPaper key={order} prerequisites={item.prerequisites} />
      );
    });
    return result;
  };
  // showListPapers=(list)=>{
  //   let result = null;
  //   result= list.map(item=>)
  // }
  showCorequisitesPapers = list => {
    let result = null;
    result = list.map((item, order) => {
      return <CorequisitesPaper key={order} corequisites={item.corequisites} />;
    });
    return result;
  };
  showStudySuggest = list => {
    let result = null;
    result = <SuggestSetStudyPlan list={list} />;
    return result;
  };
  showFollowingPapers = list => {
    let result = null;
    result = list.map((item, index) => {
      return (
        <FollowingPapers
          key={index}
          following={item.followingPaper}
          name={item.name}
        />
      );
    });
    return result;
  };
  renderAction = (list, paperGiven, actionGiven) => {
    if (actionGiven === 'prerequisites') {
      return this.showPrerequisitesPapers(list, paperGiven);
    } else if (actionGiven === 'elective') {
      return this.showElectivePapers(list);
    } else if (actionGiven === 'corequisites') {
      return this.showCorequisitesPapers(list);
    } else if (actionGiven === 'suggested') {
      return this.showStudySuggest(list);
    } else if (actionGiven === 'following') {
      return this.showFollowingPapers(list);
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
              <div className="text-body-received">
                Welcome to chatbot AUT, please let me know if you need any help
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
                        <div className="text-body-sender">{mes.userSent}</div>
                      </div>
                    </div>
                    <div className="message-received">
                      <div className="text-body-received">
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
