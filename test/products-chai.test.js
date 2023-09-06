import chai from "chai";
import mongoose from "mongoose";
import {ProductsService} from "../src/services/products.service.js";

const expect = chai.expect;

describe("Testing para productos", () => {
    before(async () => {
        await mongoose.connect("mongodb+srv://Pingua2409:Nejigua89@cluster0.xsvcjbq.mongodb.net/prueba3DB?retryWrites=true&w=majority");  
    });

    it("Testing para buscar un producto por su ID", async () => {
        //this.timeout(5000);
        const getProduct = new ProductsService();
        const productId = "64c1dc26050a67f9aa98910f";
        const productById = await ProductsService.getProductById(productId);
        
        expect(productById).to.exist;
        expect(productById._id.toString()).to.equal(productId);
          
    });
});