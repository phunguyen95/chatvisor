import React, { Component } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import routes from './routes';
import './pages/css/main.css';
class App extends Component {
  showRoutes = routes => {
    let result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return (
          <div>
            <Header />
            <Route
              index={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          </div>
        );
      });
    }
    return <Switch>{result}</Switch>;
  };

  render() {
    return (
      <Router>
        <div>{this.showRoutes(routes)}</div>
      </Router>
    );
  }
}

export default App;
