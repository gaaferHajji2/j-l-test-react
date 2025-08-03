import "./App.css";

import Alert from "./components/Alert";

import { AlertType } from "./constant";

function App() {
  return (
    <>
      <Alert
        msg="Something Happened"
        title="Oh no!!!"
        type={AlertType.warning}
        closeable={true}
      />
      <Alert
        msg="Msg Info Here"
        title="Info"
        type={AlertType.information}
        closeable={false}
      />
    </>
  );
}

export default App;
