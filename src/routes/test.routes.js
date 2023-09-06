import { Router } from "express";
import { logger } from "../utils/logger.js";

const router = Router();

router.get("/", (req,res)=>{
    logger.fatal("Error critico en nuestra aplicación");
    logger.error("Errores complejos en nuestra aplicación");
    logger.warning("Mensajes de advertencia");
    logger.info("Mensajes informativos del progreso del programa o resultados significativos");
    logger.http("Protocolo HTTP, comunicación del cliente y el servidor");
    logger.debug("Información o captura de mensajes dentro del codigo mientras se ejecuta");
    res.send ("Tester de los diferentes tipos de logger");
});

export { router as testRouter};