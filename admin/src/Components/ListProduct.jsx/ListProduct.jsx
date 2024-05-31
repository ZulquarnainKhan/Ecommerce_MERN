import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import crossIcon from '../../assets/cart_cross_icon.png'

const ListProduct = () => {

    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async()=>{
        await fetch('https://ecommerce-mern-nl0n.onrender.com/allproducts').then((resp)=>resp.json()).then((data)=>{setAllProducts(data)})
    }

    useEffect(()=>{
        fetchInfo();
    },[])

    const removeProduct = async(id)=>{
        await fetch("https://ecommerce-mern-nl0n.onrender.com/removeproduct",{
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({id : id})
        })
        await fetchInfo();
    }

  return (
    <div className='list-product'>
        <h1>All Product List</h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>

        <div className="listproduct-allproducts">
            <hr/>
            {allproducts.map((product,index) => {
                return (<><div key={index} className="listproduct-format-main listproduct-format">
                    <img src={product.image} className='listproduct-product-image'></img>
                    <p>{product.name}</p>
                    <p>${product.old_price}</p>
                    <p>${product.new_price}</p>
                    <p>{product.category}</p>
                    <img onClick={()=>{removeProduct(product.id)}} src={crossIcon} alt="" className='listproduct-remove-icon'/>
                </div>
                <hr/>
                </>)

            })}
        </div>
    </div>
  )
}

export default ListProduct