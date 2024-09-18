const Order = require("../models/Order")
const eah  = require("express-async-handler")
const express = require('express');
const router = express.Router() 
const Cart = require("../models/Cart")

router.post('/', eah(async (req, res) => {
  const { products,cartId } = req.body;
  console.log(cartId)
  try {
    const order = await Order.create({
      userId:req.user.id, 
      products,
    });
    const cart = await Cart.findByIdAndUpdate(cartId,{products:[]})

    
    res.status(201).json({success:true,message:"Order created successfully."});
  } catch (error) {
    console.log(error)
    throw new Error('Order creation failed.')
  }
}));
router.get("/pending",eah(async(req,res)=>{
  const orders = await Order.find({isPending:false})
  res.json({success:true,data:orders})
}))
router.get(
  "/",
  eah(
    async(req,res)=>{
      try{
        const orders = await Order.find({userId:req.user.id}).sort({createdAt:-1}).populate('products')
        res.json({success:true,data:orders});
      }
      catch(err){
        console.log(err)  
        throw new Error('Order cannot be fetched')
      }
    }
  )
)

router.delete(
  "/:orderId",
  eah(
    async(req,res)=>{
      try{
        const order = await Order.findByIdAndDelete(req.params.orderId);
        res.json({
          success:true,
          message:"Order successfully deleted."
        })
      }
      catch(err){
        console.log(err)
        throw new Error("Order deletion failed.")
      }
    }
  )
)
router.put("/:id",eah(async(req,res)=>{
  await Order.findByIdAndUpdate(req.params.id,{isPending:false})
  res.json({success:true,message:"Order has been finalised."})
}))

module.exports = router