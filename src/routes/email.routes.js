import { Router } from "express";
import { transporter } from "../config/email.js";
import { logger } from "../utils/logger.js";

const router = Router();

//creacion del cuerpo del correo
const emailTemplate = `<div>
        <h1>Bienvenido!!</h1>
        <img src="https://t4.ftcdn.net/jpg/02/59/09/37/360_F_259093785_4xKtZVIi2LgS7hIz8WZ9B9qQmdwDpFyk.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="https://www.google.com/">Explorar</a>
</div>`;



//Estructura del correo
const mailOptions = {
    from:"ecommerce",
    to:"bgutierrez.mil@gmail.com",
    subject:"Registro exitoso",
    html:emailTemplate,
};

//ruta para enviar el correo
router.post("/",async(req,res)=>{
    try{
        //usar el transports con la estructura del correo
        const info = await transporter.sendMail(mailOptions);
        logger.info("info: ", info);
        res.json({status:"success", message:`Correo enviado a ${mailOptions.to}`});
    }catch(error){
        logger.error(error.message);
        res.json({status:"error", message:"hubo un error al enviar el correo"});
    }
});

export { router as emailRouter};