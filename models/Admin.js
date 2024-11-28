import { Schema, model} from "mongoose";

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
});

export default model("Admin", AdminSchema);