import { ICharacterState, removeCharacterById } from "../reducers";
import { useCharacterDispatch } from "../store";



interface Props {
    addedCharacters: ICharacterState[];
}

const AddedCharacters = ({ addedCharacters }: Props) => {

  const dispatch = useCharacterDispatch();


  return (
    addedCharacters.length > 0 && <ul className="list-none list-border">
      {addedCharacters.map((character: ICharacterState, index: number) => (
        <div className={`d-flex  ${(addedCharacters.length -1) == index ? 'border-bottom-02' : 'border-bottom'}`} key={character.id}>
          <li>{character.name}</li>

          <button onClick={() => dispatch(removeCharacterById(character.id))}>
            -
          </button>
        </div>
      ))}
    </ul>
  )
}

export default AddedCharacters