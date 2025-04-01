// import { useState } from "react";
// import NavBar from "./components/NavBar";
// import Cart from "./components/Cart";
// import ExpandableText from "./components/ExpandableText/ExpandableText";
// import Form from "./components/Form/Form-03";

import { useState } from "react";
import ExpenseList from "./Grocery-shop/ExpenseList";
import ExpenseSelect from "./Grocery-shop/ExpenseSelect";
import ExpenseForm from "./Grocery-shop/ExpenseForm";
// import { FieldValues } from "react-hook-form";

import { ExpenseFormData } from "./Grocery-shop/ExpenseForm";

// export const categories = [
//   { name: "J-L-01", val: "Jafar-Loka-01" },
//   { name: "J-L-02", val: "Jafar-Loka-02" },
//   { name: "J-L-03", val: "Jafar-Loka-03" },
//   { name: "J-L-04", val: "Jafar-Loka-04" },
// ] as const;



function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  // let data = [];

  const [expenseList, setExpenseList] = useState([
    { id: 1, category: "J-L-01", description: "Jafar-Loka-01", amount: 12.99 },
    { id: 2, category: "J-L-01", description: "Jafar-Loka-01", amount: 12.99 },

    {
      id: 3,
      category: "J-L-02",
      description: "Jafar-Loka-01",
      amount: 1500.99,
    },
    {
      id: 4,
      category: "J-L-02",
      description: "Jafar-Loka-01",
      amount: 3000.99,
    },

    {
      id: 5,
      category: "J-L-03",
      description: "Jafar-Loka-01",
      amount: 3000.99,
    },
    {
      id: 6,
      category: "J-L-03",
      description: "Jafar-Loka-01",
      amount: 3000.99,
    },
  ]);

  let handleDelete = (id: number) =>
    setExpenseList(expenseList.filter((item) => item.id !== id));

  let handleSelectCategory = (category: string) => {
    console.log("The Catgeory Selected is: ", category);
    setSelectedCategory(category);
  };

  let handleSubmit = (data: ExpenseFormData) => {
    setExpenseList([...expenseList, { id: expenseList.length + 1, description: data.description, amount: data.amount, category: data.category}]);
    
    // console.log(expenseList);
  }

  return (
    // <ExpandableText maxChars={100}>
    //   Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor velit soluta quod est illo rem
    //   tempora consequatur omnis quas vitae, ducimus pariatur voluptatibus cumque ipsa sit cum, ex quasi
    //   totam sint culpa voluptas labore nulla. Fuga qui ducimus, cupiditate tenetur, fugiat quidem illo
    //   placeat fugit eligendi dicta exercitationem beatae maxime pariatur quos soluta, aliquam repudiandae!
    //   Velit vel quo veritatis eveniet? Nesciunt laudantium culpa deserunt velit, assumenda ad repellendus
    //   atque porro mollitia officia dolores cumque recusandae, omnis voluptate ea fuga sit possimus totam!
    //   Ut reprehenderit quasi qui sapiente, veniam nisi provident accusantium voluptate, a pariatur corrupti
    //   quibusdam neque impedit eos fugit.
    // </ExpandableText>
    <>
      <ExpenseForm onSubmit={ handleSubmit }/>
      <p></p>
      <ExpenseSelect onSelectCategory={ handleSelectCategory } />
      <p></p>
      <ExpenseList
        expenses={
          selectedCategory === ""
            ? expenseList
            : expenseList.filter((item) => item.category === selectedCategory)
        }
        onDelete={ handleDelete }
      />
    </>
  );
}

export default App;
