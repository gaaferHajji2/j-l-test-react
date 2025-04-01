
import { useSelector } from "react-redux";

import { productsApi } from "../slice/ApiSlice"

const Data = () => {
    

    const selectProductsResult = productsApi.endpoints.getAllProducts.select();

    const { data: posts, isLoading } = useSelector(selectProductsResult);

    const { data: products, isLoading: isJL, isError }= productsApi.useGetAllProductsQuery();

    console.log("The Posts From RTK Query Is: ", posts);
    console.log("The Products Are: ", products);

    return (
        <>
            {isLoading && <div>Data is Loading...</div>}

            {isJL && <div>Data Products is Loading</div>}

            { isError && <div> We Have Error </div>}

            <ul>
            Jafar Loka Data is: { 
                products != undefined && products['products']?.map((product, index) => 
                    <div key={index}>
                        <li>Product Id: {product.id}</li>
                        <li>Product Title: {product.title}</li>
                        <li>Product Category: {product.category}</li>
                        <li>Product Price: {product.price}</li>
                        <li>Product Description: {product.description}</li>
                        <hr />
                    </div>
                )
            }
            </ul>
        </>
    )
}

export default Data