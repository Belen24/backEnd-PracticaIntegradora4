
import { ProductsService } from "../services/products.service.js";

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
            //validamos si el usuario que esta borrando el producto es premiun
            if(req.user.role === "premium" && product.owner == req.user._id || req.user.role === "admin"){
                const result = await ProductsService.deleteProduct(productId);
            
                // Envía el correo electrónico si el usuario es premium
                if (req.user.role === "premium") {
                    // Configura el transporte de correo (debes configurar esto según tu proveedor de correo)
                    const transporter = nodemailer.createTransport({
                        service: 'tu_servicio_de_correo',
                        auth: {
                            user: 'tu_correo_electronico',
                            pass: 'tu_contraseña',
                        },
                    });

                    // Contenido del correo electrónico
                    const mailOptions = {
                        from: 'tu_correo_electronico',
                        to: req.user.email,
                        subject: 'Producto Eliminado',
                        text: `Tu producto "${product}" ha sido eliminado`,
                    };

                    // Envía el correo electrónico
                    await transporter.sendMail(mailOptions);
                }
    
                res.json ({status:"success", message:result});
                
            }else{
                res.json ({status:"error", message:"no tienes permisos"}); 
            }
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    
    
}