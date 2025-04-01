import ListGroup from "./components/ListGroup";

import Button from "./components/Button";

function App() {
  let items = [
    'SYRIA',
    'DAMASCUS',
    'RIF-DAMASCUS',
    'LATTAKIA',
    'TARTOUSE',
    'JABLEH'
  ];

  const handleSelectedItem = (item: string) => console.log("The Main Function is called with item: ", item);

  return (
    <>
      {/* <Alert>
        Jafar Loka-01 Says: Salam Alekoum
        <h2>Jafar Loka-01 is ITE Developer</h2>
      </Alert> */}

      <Button onClick={() => console.log('Button Clicked')} color="dark">
        Jafar Loka Say: Salam Alekoum
      </Button>

      <Button onClick={() => console.log('Button Clicked')}>
        Jafar Loka Say: Salam Alekoum
      </Button>

      {/* <Button onClick={() => console.log('Button Clicked')} color="react">
        Jafar Loka Say: Salam Alekoum
      </Button> */}

      <ListGroup items={items} heading="Jafar-Loka-01 Test List Group-01" onSelectedItem={ handleSelectedItem } />
    </>
  );
}

export default App
