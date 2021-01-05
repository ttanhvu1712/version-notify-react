import React, { Component, Fragment } from "react";
import { withSnackbar } from "notistack";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { Button } from "@material-ui/core";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newVersionAvailable: false,
      waitingWorker: {},
    };
  }

  onServiceWorkerUpdate = (registration) => {
    console.log("On Service Worker Update", registration);
    this.setState({
      waitingWorker: registration && registration.waiting,
      newVersionAvailable: true,
    });
  };

  updateServiceWorker = () => {
    const { waitingWorker } = this.state;
    waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
    this.setState({ newVersionAvailable: false });
    window.location.reload();
  };

  refreshAction = (key) => {
    return (
      <Fragment>
        <Button
          className="snackbar-button"
          size="small"
          onClick={this.updateServiceWorker}
        >
          {"refresh"}
        </Button>
      </Fragment>
    );
  };

  componentDidMount = () => {
    if (process.env.NODE_ENV === "production") {
      serviceWorkerRegistration.register({
        onUpdate: this.onServiceWorkerUpdate,
      });
    }
  };

  componentDidUpdate = () => {
    const { enqueueSnackbar } = this.props;
    const { newVersionAvailable } = this.state;

    if (newVersionAvailable) {
      this.setState({ newVersionAvailable: false });
      enqueueSnackbar("A new version was released", {
        persist: true,
        variant: "success",
        action: this.refreshAction(),
      });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload = v1.1
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
export default withSnackbar(App);
