import { CartsService } from "../services/carts.service.js";
import { CustomError } from "../services/error/customError.service.js";
import { EError } from "../enums/EError.js";
import { generateCartErrorParams } from "../services/error/cartErrorParams.service.js";
import mongoose from "mongoose";
import { errorHandler} from "../middlewares/errorHandler.js"
//import { ProductsService } from "../services/products.service.js";

export class CartsController{
    static createCart = async(req,res)=>{
        try {
            const cartCreated = await CartsService.createCart();
            res.json({status:"success", data:cartCreated});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static get = async (req,res)=>{
        try {
            const cartId = req.params.cid;
            //const Idcart = parseInt(cartId)
            const getCart = await CartsService.get(cartId);
            res.json ({status:"success", data:getCart})
        } catch (error) {
            throw new Error(`Error al visualizar el carrito ${error.message}`);
        }
    };

    
    static getCartById = async(req,res)=>{
        try {
            const {id} = req.params;
            //const cartId= parseInt(id);
            //console.log(cartId);
            const cartById = await CartsService.getCartById(id);
            res.json({status:"success",data:cartById});
            //res.render("carts", { cart: cartById });
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static async renderCart(req, res) {
        try {
          const { id } = req.params;

          var cid = mongoose.Types.ObjectId.isValid(id);
          console.log(cid);

          if(cid === false){
            //throw new Error("El parámetro 'id' no se envió o no es válido.");
            CustomError.createError({
                name: "Error id carrito",
                cause: generateCartErrorParams(id),
                message: "Error obteniendo el carrito",
                errorCode: EError.INVALID_PARAMS,
            });
        } 
          const cartById = await CartsService.getCartById(id);
          console.log(cartById);
         
          res.render("carts", { cart: cartById });
          //res.json({status:"success",data:cartById});
        } catch (error) {
          //res.status(500).send("Error al renderizar la vista del carrito");
          //res.json({ status: "error", message: error.message });
          errorHandler(error,null,res);
        
        }
      };

    static addProduct = async(req,res)=>{
        try {
            const {cid, pid} = req.params;
            const addProductCart = await CartsService.addProduct(cid, pid);
            res.json({status:"success",data:addProductCart});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };
    
    static purchase = async(req,res)=>{
        try {
            const {cid} = req.params;
            const cartPurchase = await CartsService.purchase(cid);
            res.json({status:"success",data:cartPurchase});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static deleteCart = async (req, res) =>{
        try {
            const {cid} = req.params;
            const cartDelete = await CartsService.deleteCart(cid);
            res.json({status:"success",data:cartDelete});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static deleteProduct = async (req, res) =>{
        try {
            const {cid, pid} = req.params;
            const productDelete = await CartsService.deleteProduct(cid, pid);
            res.json({status:"success",data:productDelete});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    }
    
    
}