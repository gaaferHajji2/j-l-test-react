import "./App.css";
import Alert, { AlertType } from "./components/Alert";

function App() {
  return (
    <>
      <Alert
        msg="Something Happened"
        title="Oh no!!!"
        type={AlertType.warning}
      />
      <Alert
        msg="Msg Info Here"
        title="Info"
        type={AlertType.information}
      />
    </>
  );
}

export default App;
