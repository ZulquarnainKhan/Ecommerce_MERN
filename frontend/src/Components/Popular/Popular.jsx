import React, { useEffect , useState} from "react";
import "./Popular.css";
// import data_product from "../Assets/data";
import Item from "../Item/Item";
const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  useEffect(()=>{
    fetch('https://ecommerce-mern-nl0n.onrender.com/popularinwomen').then((res)=>res.json()).then((data)=>setPopularProducts(data))
  },[])


  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, idx) => {
          // console.log({ item });
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

export default Popular;