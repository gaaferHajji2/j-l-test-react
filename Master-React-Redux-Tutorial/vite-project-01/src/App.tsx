import { useSelector } from 'react-redux';
import './App.css';
import { storeState } from './store';
// import { getAllCharacters } from './reducers';

// import { ICharacterState, addCharacterById } from './reducers';
import ListCharacters from './component/ListCharacters';
import AddedCharacters from './component/AddedCharacters';

function App() {
  const characters = useSelector((state: storeState) => state.characters);

  const data = characters.data;

  const addCharacters = characters.addedData;

  // const addCharacters = useSelector((state: storeState) => state.characters.addedData);


  // console.log('All Characters Using Dispatch is: ', dispatch(getAllCharacters()));

  console.log('The Characters Are', data);

  console.log('The Added Characters Are: ', addCharacters);

  return (
    <div className='mx-5 d-flex-row'>
      <ListCharacters data={data}/>

      <AddedCharacters addedCharacters={addCharacters} />
      
    </div>
  );
}

export default App;
