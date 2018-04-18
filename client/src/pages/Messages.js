import React, { Component } from 'react';

export default class Messages extends Component {
  constructor(props) {
    super(props);

    this.scrollDown = this.scrollDown.bind(this);
  }

  scrollDown() {
    const { container } = this.refs;
    container.scrollTop = container.scrollHeight;
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown();
  }

  render() {
    const { messages } = this.props;
    console.log(messages);
    return (
      <div ref="container" className="thread-container">
        <div className="thread">
          {messages.map(mes => (
            <div
              key={mes.id}
              className={`message-container 
                'right'}`}
            >
              <div className="data">
                <div className="message">{mes.message}</div>
                <div className="message">{mes.single}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
