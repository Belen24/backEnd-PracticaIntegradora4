import { productsModel } from "../daos/models/products.model.js";
import mongoose from "mongoose";
import { config} from "../config/config.js";

await mongoose.connect(config.mongo.url);
//Función para actualizar todos los productos de nuestra base de datos
const updateProducts = async()=>{
    try {
        //const products = await productsModel.find();
        //console.log("products", products);
        const adminId="64c1da2a4d0ca3e05dec6a60";//ID administrador
        const result = await productsModel.updateMany({},{$set:{owner:adminId}});
        console.log("result", result);

    } catch (error) {
        console.log(error.message);
    }
}

updateProducts();