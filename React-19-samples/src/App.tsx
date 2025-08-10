import "./App.css";

import Alert from "./components/Alert";
import { PersonScore } from "./components/PersonScore";

import { AlertType } from "./constant";

function App() {
  return (
    <>
      <Alert
        title="Oh no!!!"
        type={AlertType.warning}
        closeable={true}
        onClose={() => alert("Alert Closed")}
      >
        <h3>Something Happened</h3>
      </Alert>
      <Alert
        title="Info"
        type={AlertType.information}
        closeable={false}
      ><h3>Msg Info Here</h3></Alert>

      <PersonScore />
    </>
  );
}

export default App;
