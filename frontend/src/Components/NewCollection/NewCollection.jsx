import React,{useState, useEffect} from "react";
import "./NewCollection.css";
// import newCollection from "../Assets/new_collections";
import Item from "../Item/Item";
const NewCollections = () => {

  const [newCollection, setNewCollection] = useState([])


  useEffect(()=>{
    fetch('https://ecommerce-mern-nl0n.onrender.com/newcollections').then((res)=>res.json()).then((data)=>setNewCollection(data))
  },[])

  return (
    <div className="newcollections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newCollection.map((item, idx) => {
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

export default NewCollections;