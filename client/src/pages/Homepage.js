import React, { Component } from 'react';
import axios from 'axios';
import Messages from './Messages';

class HomePage extends Component {
  state = {
    message: '',
    response: []
  };
  submitForm = e => {
    e.preventDefault();

    const request = axios
      .post('/api/submitMessage', {
        message: this.state.message
      })
      .then(result => {
        this.setState({
          response: [...this.state.response, result.data]
        });
        this.setState({
          message: ''
        });
      });
  };
  handleInput = event => {
    this.setState({
      message: event.target.value
    });
  };

  render() {
    return (
      <div className="wrapped-main">
        <div className="wrapped-container">
          <div className="container">
            <div className="inside-container">
              <div className="primary-content">
                {this.state.response ? (
                  <Messages messages={this.state.response} />
                ) : null}
              </div>
              <form className="form-text" onSubmit={this.submitForm}>
                <input
                  className="input-text"
                  type="text"
                  value={this.state.message}
                  placeholder="Type your message here"
                  onChange={this.handleInput}
                />
                <img
                  className="icon-send"
                  src="/img/send-icon.png"
                  alt="No image"
                  onClick={this.submitForm}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
