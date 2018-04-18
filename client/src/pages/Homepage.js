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
      <div>
        <form onSubmit={this.submitForm}>
          {this.state.response ? (
            <Messages messages={this.state.response} />
          ) : null}
          <input
            type="text"
            value={this.state.message}
            onChange={this.handleInput}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default HomePage;
