import React, { Component } from 'react';
import axios from 'axios';
import Messages from './Messages';

class HomePage extends Component {
  state = {
    message: '',
    response: [],
    loading: false
  };
  submitForm = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    const request = axios
      .post('/api/submitMessage', { message: this.state.message})
      .then(result => {
        this.setState({
          response: [...this.state.response, result.data]
        });
        this.setState({
          message: '',
          loading: false
        });
      });
  };
  handleInput = event => {
    this.setState({
      message: event.target.value
    });
  };
  constructor(props) {
    super(props);
    this._onResize = this._onResize.bind(this);
    this.scrollMessagesToBottom = this.scrollMessagesToBottom.bind(this);
  }

  _onResize() {
    this.setState({
      height: window.innerHeight
    });
  }

  scrollMessagesToBottom() {
    if (this.messagesRef) {
      this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
    }
  }
  componentDidUpdate() {
    this.scrollMessagesToBottom();
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }
  render() {
    return (
      <div className="wrapped-main">
        <div className="wrapped-container">
          <div className="container">
            <div className="inside-container">
              <div
                ref={ref => (this.messagesRef = ref)}
                className="primary-content"
              >
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
                  disabled={this.state.loading ? 'disabled' : ''}
                  required
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
