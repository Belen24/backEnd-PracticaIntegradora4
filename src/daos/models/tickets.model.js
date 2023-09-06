import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code:{ type: String, default: uuidv4(), unique: true, required: true },
    purchase_datetime:{type:Date},
    amount:{type:Number, required:true},
    //purchaser:{type:String, required:true}
});

export const ticketsModel = mongoose.model(ticketsCollection,ticketSchema);