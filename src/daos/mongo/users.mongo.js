import {UserModel} from "../models/users.model.js";
import nodemailer from "nodemailer";
import {config} from "../../config/config.js"

export class UserMongo{
    constructor(){
        this.model=UserModel;
    };
    
    async get(){
        try {
            const user = await this.model.find();
            return user;
        } catch (error) {
            throw new Error ("No se pudieron obtener los Usuarios");
        }
    };

    async getUserByEmail(emailUser){
        try {
            const user = await this.model.findOne({email:emailUser});
            if(user){
                return JSON.parse(JSON.stringify(user));
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    };

    async getUserById(userId){
        try {
            const user = await this.model.findById(userId);
            if(!user){
                //throw new Error("El usuario no existe");
                return null;
            }
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    };

    async saveUser(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    };

    async updateUser(userId,newInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId,newInfo,{new:true});
            if(!userUpdated){
                throw new Error("usuario no encontrado");
            }
            return userUpdated;
        } catch (error) {
            throw error;
        }
    };

    async delete(){
        try {
            const diezMinutosAtras = new Date();
            diezMinutosAtras.setMinutes(diezMinutosAtras.getMinutes() - 10);

            const usuariosInactivos = await this.model.find({ last_connection: { $lt: diezMinutosAtras } });

            for (const usuario of usuariosInactivos) {
                // Envía un correo electrónico al usuario antes de eliminarlo
                const transporter = nodemailer.createTransport({
                  // Configuración del servidor de correo electrónico
                    service: 'Gmail',
                    auth: {
                        user: config.gmail.marketingEmail,
                        pass: config.gmail.password,
                    },
                    tls:{
                    rejectUnauthorized:false
                    }
                });

                const mensaje = {
                    from: 'bgutierrez.mil@gmail.com',
                    to: usuario.email,
                    subject: 'Eliminación de cuenta por inactividad',
                    text: 'Tu cuenta ha sido eliminada por inactividad.',
                };

                await transporter.sendMail(mensaje);

                // Elimina el usuario de la base de datos
                const result = await this.model.deleteMany({ last_connection: { $lt: diezMinutosAtras } });
            }

        console.log('Usuarios inactivos eliminados y correos electrónicos enviados.');



        } catch (error) {
            console.error('Error al eliminar usuarios inactivos', error);
        }
    };

    async deleteUser(userId){
        try {
            await this.model.findByIdAndDelete(userId);
            return {message: "Usuario eliminado"};
            } catch (error) {
                throw new Error(`Error al eliminar al Usuario ${error.message}`);
        }
        
    };
    
}