import { Router } from "express";
import { totalProducts } from "../faker.js";

const router = Router();

router.get ("/", (req,res) =>{
    const products = totalProducts();
    res.json(products);
});

export { router as mockingproductsRouter};