import { UserGetDto } from "../daos/dto/user.dto.js";
import { UsersService } from "../services/users.service.js";

export class UserController {
    static get = async(req,res)=>{
        try {
            const users = await UsersService.get();
            console.log(users);
            const newUsers = users.map(user => new UserGetDto(user));
            res.json({status:"success", data:newUsers});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };

    static modifyRole = async(req,res)=>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;
            const userStatus = user.status;
            if(userRole === "user" && userStatus === "Completo"){
                user.role = "premium";
            }else if (userRole === "premium"){
                user.role = "user";
            }else{
                res.status(400).send("No es posible cambiar el role del usuario, no tiene todos los documentos cargados");
                return;
            };
            const result = await UsersService.updateUser(userId, user);
            res.send("Rol del usuario modificado");
        } catch (error) {
            res.send(error.message)
        }
    };

    static uploadDocuments = async(req,res)=>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);
            if(!user){
                return res.json({status:"error", message:"El usuario no existe"});
            }
            // console.log("req.files", req.files);
            const identificacion = req.files["identificacion"][0] || null;
            const domicilio = req.files["domicilio"]?.[0] || null;
            const estadoDeCuenta = req.files["estadoDeCuenta"][0] || null;
            const docs = [];
            if(identificacion){
                docs.push({name:"identificacion", reference:identificacion.filename})
            }
            if(domicilio){
                docs.push({name:"domicilio", reference:domicilio.filename})
            }
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference:estadoDeCuenta.filename})
            }
            console.log(docs)
            user.documents = docs;
            if(user.documents.length===3){
                user.status = "Completo";
            } else {
                user.status = "Incompleto";
            }
            await UsersService.updateUser(user._id,user);
            res.json({status:"success", message:"solicitud procesada"});
        } catch (error) {
            res.send(error.message);
        }
    };

    static delete = async(req,res)=>{
        try {
            await UsersService.delete();

            res.json({ status: 'success', message: 'Usuarios inactivos eliminados y correos electrónicos enviados.' });
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos', error);
            res.json({ status: 'error', message: 'Error al eliminar usuarios inactivos' });
        }
    };

    static deleteUser = async (req, res) =>{
        try {
            const {userId} = req.params;

            // Verificar si el ID del usuario es válido
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ status: 'error', message: 'ID de usuario no existe o fue ingresado de forma incorrecta.' });
            }

            const userDelete = await UsersService.deleteUser(userId);
            res.json({status:"success",data:userDelete});
        } catch (error) {
            res.json({status:"error", message:error.message});
        }
    };
}