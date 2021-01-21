import React, { useState, useEffect } from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { notification } from "antd";

const App = () => {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState({})

 useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      serviceWorkerRegistration.register({
        onUpdate: onServiceWorkerUpdate,
        onSuccess: onServiceWorkerUpdate,
      })
    }
  }, [])

  useEffect(() => {
    if (newVersionAvailable) {
      setNewVersionAvailable(false)
      notification.open({
        message: 'New version available',
        description: 'A new version was released. Click here to get it.',
        placement: 'bottomLeft',
        onClick: updateServiceWorker,
      })
    }
  }, [newVersionAvailable])

  const onServiceWorkerUpdate = (registration) => {
    console.log(registration)
    setWaitingWorker(registration && registration.waiting)
    setNewVersionAvailable(true)
  }

  const updateServiceWorker = () => {
    waitingWorker?.postMessage && waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    setNewVersionAvailable(false)
    window.location.reload()
  }

    return (
      <div className="App">
        <header className="App-header">
          <img src={"/logo512.png"} className="App-logo" alt="logo" />
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
export default App;
