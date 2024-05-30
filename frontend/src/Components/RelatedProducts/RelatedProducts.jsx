import React , {useEffect, useState} from "react";
import "./RelatedProducts.css";
// import data_product from "../Assets/data";
import Item from "../Item/Item";
const RelatedProducts = () => {
  const [data_product, setData_product] = useState([]);
  useEffect(()=>{
    fetch('http://localhost:4000/newcollections').then((res)=>res.json()).then((data)=>setData_product(data))
  },[])
  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item" style={{maxWidth:"100%",overflowX:"scroll"}}>
        {data_product.map((item, idx) => {
          return (
            <Item
              key={idx}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;