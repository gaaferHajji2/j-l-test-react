import { MouseEvent, useState } from "react";

// import styled from "styled-components";

interface Props {
  items: string[];
  heading: string;
  onSelectedItem: (item: string) => void;
}

const ListGroup = ({ items, heading, onSelectedItem }: Props) => {

  const [ selectedIndex, setSelectedIndex ] = useState<Number>(-1); 

  // items = [];

  // const message = items.length === 0 ? <p>No Items In Jafar-Loka-01 List</p> : null;

  // const getMessage = () => { return items.length === 0 ? <p>No Items In Jafar-Loka-01 List</p> : null }

  const handleClick = (event: MouseEvent, item: string, index: Number) => {
    // console.log("The item ", item, " Clicked with index: ", index); 
    console.log(event);

    setSelectedIndex(index);
    onSelectedItem(item);
  }


  return (
    <>
      <h1>{heading}</h1>

      {/* { getMessage() } */}

      {/* { items.length === 0 ? <p>No Items In Jafar-Loka-01 List</p> : null } */}

      { items.length === 0 && <p>No Items In Jafar-Loka-01 List</p> }

      <ul className="list-group">
        { items.map(
          (item, index) => 
          <li 
            className={ selectedIndex === index ? 'list-group-item active' : 'list-group-item'} 
            key={item} 
            onClick={(e) => handleClick(e, item, index) }> 
              {item}
          </li>) }
      </ul>
    </>
  )
}

export default ListGroup