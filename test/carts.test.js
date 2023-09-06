import mongoose from "mongoose";
import {CartsService} from "../src/services/carts.service.js";
import Assert from "assert";

const assert = Assert.strict;


describe("Testing para Carts", ()=>{
    before(async () => {
        await mongoose.connect("mongodb+srv://Pingua2409:Nejigua89@cluster0.xsvcjbq.mongodb.net/prueba3DB?retryWrites=true&w=majority");  
    });

    it("El testing debe crear un carrito con exito", async function(){
        this.timeout(5000);
        const carts = new CartsService();
        const cartCreate = await CartsService.createCart();

        assert.strictEqual(cartCreate.products.length, 0);
        assert.ok(cartCreate._id);
        console.log(cartCreate);
    })
    
})