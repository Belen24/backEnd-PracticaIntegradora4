import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import { ticketsModel } from "../models/tickets.model.js";
import nodemailer from "nodemailer";
import {config} from "../../config/config.js"




export class CartsMongo{
    constructor(){
        this.model=cartsModel;
    };

    async createCart(){
        try {
            const cart = {
                products:[]
            };
            const cartCreated = await this.model.create(cart);
            return cartCreated;
        } catch (error) {
            throw error;
        }
    };

    async get(cartId){
        try {
            const result = await this.model.findOne({_id:cartId})
            
            if(!result){
                throw new Error(`No se encontro el carrito ${error.message}`);
            }
            //convertir el formato bson a json
            const data = JSON.parse(JSON.stringify(result));
            return data;
        } catch (error) {
            throw new Error(`Error create cart ${error.message}`);
        }
    };

    async getCartById(id){
        try {
            const data = await this.model.findById(id);
            if(!data){
                throw new Error("el carrito no existe")
            }
            const result = JSON.parse(JSON.stringify(data));
            return result;
        } catch (error) {
            throw new Error(`Error al obtener carrito ${error.message}`);
        }

        
    };

 
    async addProduct(cid, pid) {
        //console.log(pid);
        
        try {
            const cart = await this.get(cid);
            //console.log("cart", cart);
            //console.log(cart.products[0]);
            //console.log(cart.products.map ((products) => products));
            const existingProductIndex = cart.products.findIndex((product) => product.productId._id === pid);
            console.log(existingProductIndex);
    
            if (existingProductIndex !== -1) {
                // Si el producto ya existe, simplemente incrementar la cantidad
                cart.products[existingProductIndex].quantity ++;
            } else {
                // Si el producto no existe, agregar un nuevo producto al carrito
                cart.products.push({ productId: pid, quantity: 1 });
            }
    
           
            const result = await this.model.findByIdAndUpdate(cid, cart, { new: true });
            return result;
        } catch (error) {
            throw new Error(`Error al agregar el producto ${error.message}`);
        }
    };

    
    async purchase(cid) {
       try {
        const productsApproved = [];
        const productsRejected = [];
        let fullPurchase = 0;
  
        // Verificar que el carrito exista 
        const cart = await this.getCartById(cid);
        //console.log("cart", cart);
            if (!cart) {
            throw new Error('El carrito no existe');
            } 
            if (!cart.products.length) {
                throw new Error('El carrito no tiene productos');
            }else{
                for (let i=0; i <cart.products.length; i++){
                    const productCart = cart.products[i].productId._id;
                    //console.log (productCart);
                    const productDB = await productsModel.findById(productCart);
                    //console.log(productDB);
                    let comparison = parseInt(productDB.stock) - cart.products[i].quantity;
                    console.log(comparison);
                    

                    if (comparison >=0){
                        productsApproved.push(cart.products[i]);
                        fullPurchase += productDB.price * cart.products[i].quantity;
                        console.log(fullPurchase);

                        productDB.stock = comparison;
                        console.log(productDB);
                        await productsModel.findByIdAndUpdate(productCart, { stock: comparison });
                        
                    }else{
                        productsRejected.push(cart.products[i],);
                    };
                };

                    console.log("Productos aprobados: ", productsApproved);
                    console.log ("Productos rechazados: ", productsRejected);

                    if (productsApproved.length > 0 && productsRejected.length === 0) {
                        //const user = await UserModel.findOne(req.user.email);
                        const ticketData = {
                            purchase_datetime: Date(),
                            amount: fullPurchase,
                            //purchaser: user.email
                        };
                
                        const ticketCreated = await ticketsModel.create(ticketData);
                        
                        // Envío del correo electrónico con el ticket como adjunto
       

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
          to:  'bgutierrez.mil@gmail.com', // Usar el correo electrónico del cliente
          subject: 'Ticket de compra',
          text: 'Adjunto encontrarás tu ticket de compra.',
          attachments: [
            {
              filename: 'ticket.pdf',
              content: 'Contenido del ticket aquí',
            },
          ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo electrónico: ', error.message);
          } else {
            console.log('Correo electrónico enviado con éxito: ', info.response);
          }
        });

                        return { ticket: ticketCreated, total: fullPurchase };
                    } else if (productsRejected.length > 0) {
                        // Si hay productos rechazados
                        throw new Error('Hay productos que no cuentan con el stock suficiente para generar tu compra');
                    } else {
                        // Si no hay productos rechazados y no hay productos aprobados
                        throw new Error('No hay productos aprobados para generar la compra');
                    }
            }
       }catch (error) {
         throw new Error(`Error al procesar la compra ${error.message}`);
       }
    };
    
    async deleteCart(cid){
        try {
            await this.model.findByIdAndDelete(cid);
            return {message: "Carrito eliminado"};
        } catch (error) {
            throw new Error(`Error al eliminar el carrito ${error.message}`);
        }
    
    };

    
    
    async deleteProduct(cid, pid){
        try {
            const cart = await this.model.findById(cid);

            if (!cart){
                throw new Error ("El carrito no existe");
            }

            const productIndex = cart.products.findIndex(
                (product) => product._id.toString() === pid.toString()
              );
              console.log(productIndex)
              if (productIndex !== -1) {
                throw new Error("El producto no existe en el carrito");
              }
          
              cart.products.splice(productIndex, 1);
              await cart.save();
          
              return { message: "Producto eliminado del carrito" };

        } catch (error) {
            throw new Error(`Error al eliminar el carrito ${error.message}`);
        }
    
    };


};