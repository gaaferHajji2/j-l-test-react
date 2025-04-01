import { ChangeEvent } from "react";
import categories from "./categories";

interface Props {
    onSelectCategory: (category: string) => void;
}

const ExpenseSelect = ({ onSelectCategory } : Props) => {
  return (
    <select className="form-select" onChange={ ( e:ChangeEvent<HTMLSelectElement> ) => onSelectCategory(e.target.value) }>
        <option value="">All Gategories</option>
        
        {categories.map( category => <option value={category} key={category}>{category}</option>)}
    </select>
  )
}

export default ExpenseSelect