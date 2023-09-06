import { config } from "../config/config.js";

let productsDao;
let cartsDao;
let usersDao;


const PERSISTENCE=config.server.persistence;

switch (PERSISTENCE) {
    case "mongo":
        //conexion a base de datos
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();
        const {CartsMongo} = await import("./mongo/carts.mongo.js");
        const {ProductsMongo} = await import("./mongo/products.mongo.js");
        const {UserMongo} = await import ("./mongo/users.mongo.js");
        cartsDao = new CartsMongo();
        productsDao = new ProductsMongo();
        usersDao = new UserMongo ();
        break;

    case "memory":
        const {CartFiles} = await import("./memory/carts.memory.js");
        const {ProductsFiles} = await import ("./memory/products.memory.js");
        cartsDao = new CartFiles();
        productsDao = new ProductsFiles();
        break;

};

export {productsDao, cartsDao, usersDao};