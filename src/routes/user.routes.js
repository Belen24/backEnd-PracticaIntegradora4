import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { checkUserAuthenticatedView, checkRoles} from "../middlewares/auth.js";
import { uploadUserDoc } from "../utils.js";


const router = Router();


router.get("/", UserController.get);
router.put("/premium/:uid", checkUserAuthenticatedView, checkRoles(["admin"]), UserController.modifyRole );
router.post("/:uid/documents", checkUserAuthenticatedView,uploadUserDoc.fields([{name:"identificacion",maxCount:1},{name:"domicilio",maxCount:1}, {name:"estadoDeCuenta",maxCount:1}]) , UserController.uploadDocuments)

export {router as userRouter};