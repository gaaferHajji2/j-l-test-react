// import { useState } from "react";
import ProductList from "./components/ProductListTestingEffect/ProductList";
// import SideEffect from "./components/SideEffect/SideEffect";



function App() {

  // const [ category, setCategory ] = useState("");

  return (
    <>
      <select className="form-select">
        <option value="">Select A Value</option>
        <option value="Jafar-Loka-01">Jafar-Loka-01</option>
        <option value="Jafar-Loka-02">Jafar-Loka-02</option>
        <option value="Jafar-Loka-03">Jafar-Loka-03</option>
      </select>


      {/* <ProductList category={category}/> */}
      <ProductList />
    </>
  );
}

export default App;
