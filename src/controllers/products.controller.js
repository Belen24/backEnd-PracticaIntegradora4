
import { ProductsService } from "../services/products.service.js";
import nodemailer from "nodemailer";
import {config} from "../config/config.js";

export class ProductsController{
    static getProducts = async(req,res)=>{
        try {
            const products = await ProductsService.getProducts();
            //res.json({status:"success", data:products});
            res.render("products", { email: req.user.email, products: products });
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static getProductById = async(req,res)=>{
        try {
            const productId = req.params.pid;
            const product = await ProductsService.getProductById(productId)
            res.json({status:"success", data:product});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static createProduct = async(req,res)=>{
        try {
            const productInfo = req.body;
            productInfo.owner =req.user._id;
            const productCreated = await ProductsService.createProduct(productInfo);
            res.json({status:"success", data:productCreated});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static updateProduct = async(req,res)=>{
        try {
            const productId = req.params.id;
            const modProduct = await ProductsService.updateProduct(productId, req.body);
            res.json({status:"success",data:modProduct});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static deleteProduct = async(req,res)=>{
        try {
            const productId = req.params.id;
            const product = await ProductsService.getProductById(productId);
           
            if(req.user.role === "premium" && product.owner == req.user._id || req.user.role === "admin"){
                const result = await ProductsService.deleteProduct(productId);

                // Envío correo electrónico si el usuario es premium
                if (req.user.role === "premium") {
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: config.gmail.marketingEmail,
                            pass: config.gmail.password,
                        },
                        tls:{
                            rejectUnauthorized:false
                        }
                    });

                    const mailOptions = {
                        from: 'bgutierrez.mil@gmail.com',
                        to: req.user.email,
                        subject: 'Producto Eliminado',
                        text: `Tu producto "${product.title}" ha sido eliminado. Descripción: ${product.description}`,
                    };

                    await transporter.sendMail(mailOptions);
                }
                res.json ({status:"success", message:result});
            }else{
                res.json ({status:"error", message:"no tienes permisos"}); 
            }
        } catch (error) {
            res.json({status:"error", message:"El ID ingresado no es valido"});
        }
    };
}