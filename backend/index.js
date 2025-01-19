const port = 4000;
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Stripe = require("stripe");

const stripe = new Stripe("your-secret-key");

app.use(express.json());
app.use(cors());

// DataBase Connection With MongoDB
mongoose.connect("mongodb+srv://Zulquarnain:zulquar20112003@cluster0.fvihrvg.mongodb.net/e-commerce")

// API creation
app.get("/", (req,res)=>{
    res.send("Express App is Running")
})

app.post("/create-checkout-session", async (req, res) => {
    const { cartItems } = req.body;
  
    try {
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.new_price * 100, // Stripe requires amount in cents
        },
        quantity: item.quantity,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
  
      res.status(200).json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Image Storage Engine

const storage =  multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating Upload Endpoint For Images
app.use('/images', express.static("upload/images"))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`https://ecommerce-mern-nl0n.onrender.com/images/${req.file.filename}`
    })
})

// Schema For creating products

const Product = mongoose.model("product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

// Creating API for adding Products

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0]
        id = last_product.id+1;
    }
    else{
        id = 1;
    }
    const product =  new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,     
    });
    // console.log(product);
    await product.save();
    console.log("Saved")
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for deleting Products
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    // console.log("Removed")
    res.json({
        success:true,
        name:req.body.name
    })
})

// Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products Fetched")
    res.send(products)
})

// Schema Creating for user Model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },

})

// Creating endpoint registering the user
app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false, errors:"Existing User Found with same Email Address"})
    }
    else{
        let cart = {};
        for(let i =0;i<300;i++){
            cart[i]=0;
        }

       
        // ---------------- Using Bcrypt for securing password ----------------
        var salt = await bcrypt.genSalt(11);
        let securePassword = await bcrypt.hash(req.body.password, salt);

        

        const user = new Users({
            name:req.body.username,
            email:req.body.email,
            password: securePassword,
            cartData: cart,
        })

        await user.save();

        const data = {
            user:{
                id:user.id
            }
        }

        const token = jwt.sign(data,salt);
        res.json({success: true,token})

    }
})

// Creating Endpoint For User Login
app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if(passCompare){
            const data  = {
                user:{
                    id:user.id,
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success: true, token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

// Creating endpoint for new collection data
app.get('/newcollections', async(req,res)=>{
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8);
    // console.log("newCollection Fetched")
    res.send(newcollection);
})

// Creating endpoint For popular in women section
app.get('/popularinwomen', async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popularInWomen = products.slice(0,4);
    res.send(popularInWomen)
})
// Creating middleware to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }
        catch(error){
            res.status(401).send({errors:"Please Authenticate using a valid Token"})
        }
    }
}


// creating endPoint for add to cart
app.post('/addtocart', fetchUser, async(req,res)=>{
    // console.log("Adding ",req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")

})

// Creating endpoint to remove product from cart
app.post('/removefromcart', fetchUser, async(req,res)=>{
    // console.log("Removed ",req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Removed")

})

// Creating endpoint to get cart data
app.post('/getcart', fetchUser, async(req,res)=>{
    console.log("Get Cart")
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);

})

app.listen(port, (error)=>{
    if(!error){
        console.log("Server Running On Port "+port)
    }
    else{
        console.log("Error: "+error)
    }
})