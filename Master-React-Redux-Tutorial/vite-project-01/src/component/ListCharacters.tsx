import { addCharacterById, ICharacterState } from "../reducers";
import { useCharacterDispatch } from "../store";

interface Props {
  data: ICharacterState[];
}

const ListCharacters = ({ data }: Props) => {
  const dispatch = useCharacterDispatch();

  return (
    <ul className="list-none list-border">
      {data.map((character: ICharacterState, index: number) => (
        <div className={`d-flex  ${(data.length -1) == index ? 'border-bottom-02' : 'border-bottom'}`} key={character.id}>
          <li>{character.name}</li>

          <button onClick={() => dispatch(addCharacterById(character.id))}>
            +
          </button>
        </div>
      ))}
    </ul>
  );
};

export default ListCharacters;
