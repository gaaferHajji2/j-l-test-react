import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";

import { BsFillCalendarFill } from 'react-icons/bs'
import Like from "./components/Like/Like";

function App() {

  const [ showAlert, setShowAlert ] = useState(false);


  const handleClick = () => setShowAlert(true);

  const handleClose = () => setShowAlert(false);

  const handleHeartClick = () => {
    console.log("The Heart Has Been Clicked And Toggled Status");
  }


  return (
    <>
      {showAlert && <Alert onClose={ handleClose }>Jafar-Loka-01 Alert Here</Alert>}

      <Button onClick={ handleClick } color="success">Jafar-Loka-01 Show Alert</Button>

      <BsFillCalendarFill size={40} color="green" display='block' />

      <Like onClick={ handleHeartClick }/>
    </>
  );
}

export default App
