import { productsModel } from "../models/products.model.js";

export class ProductsMongo{
    constructor(){
        this.model=productsModel;
    };

    async getProducts(){
        try {
            const products = await this.model.find();
            console.log(products);
            return JSON.parse(JSON.stringify(products));
        } catch (error) {
            throw error;
        }
    };

    async getProductById(productId){
        try {
            const product = await this.model.findById(productId);
            if(!product){
                throw new Error("El producto no existe");
            }
            return JSON.parse(JSON.stringify(product));
        } catch (error) {
            throw error;
        }
    };

    async createProduct(productInfo){
        try {
            const productCreated = await this.model.create(productInfo);
            return productCreated;
        } catch (error) {
            throw error;
        }
    };

    async updateProduct(id,product){
        try {
            const data = await this.model.findByIdAndUpdate(id,product,{new:true});
            if(!data){
                throw new Error("el producto no existe")
            }
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar el producto ${error.message}`);
        }
    };

    async deleteProduct(id){
        try {
            await this.model.findByIdAndDelete(id);
            return "Producto eliminado";
        } catch (error) {
            throw new Error(`Error al eliminar el producto ${error.message}`);
        }
    };
};