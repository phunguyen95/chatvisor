import React, { Component } from 'react';
import './css/Message.css';

export default class Messages extends Component {
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
                        <div class="text-body-sender">
                          {messages[index].userSent}
                        </div>
                      </div>
                    </div>
                    <div className="message-received">
                      <div class="text-body-received">
                        {messages[index].message}
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
