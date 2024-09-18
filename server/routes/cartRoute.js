const eah  = require('express-async-handler')

const Cart = require('../models/Cart')
const express = require('express');
const router = express.Router()

router.post(
    "/",
    eah(
        async(req,res)=>{
            try{
                const {products}=req.body
                console.log(products)
                const existingCart = await Cart.findOneAndUpdate(
                    { userId: req.user.id },
                    {
                      $addToSet: {
                        products: products 
                      }
                    },
                    { new: true }
                  );
                if(!existingCart){
                    const cart = await Cart.create({userId:req.user.id,products:[products]})
                }
                res.status(201).json({success:true,message:"Cart updated successfully"})
            }
            catch(err){
                console.log(err)
                throw new Error("Cart cannot be filled.")
            }
        }
    )
)

router.get(
    "/",
    eah(
        async(req,res)=>{
            try{
                const cart = await Cart.findOne({userId:req.user.id}).populate("products")
                res.status(200).json({success:true,data:cart})
            }
            catch(err){
                console.log(err)
                throw new Error("Cart cannot be fetched.")
            }
        }
    )
)

router.delete(
    "/",
    eah(
        async(req,res)=>{
            try{
                const {product}=req.body
                console.log(product)
                const existingCart = await Cart.findOneAndUpdate(
                    {userId:req.user.id},
                    {$pull:{
                        products:product
                        }
                    },
                    {new:true}
                )
                res.status(201).json({success:true,message:"Cart updated successfully",data:existingCart})
            }
            catch(err){
                console.log(err)
                throw new Error("Cart's items cannot be deleted.")
            }
        }
    )
)
module.exports = router