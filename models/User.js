import { Schema, model} from "mongoose";

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    courses: [
        {
            playlistId: { type: String, required: true },
            currentVideoIndex: { type: Number, default: 0 },
            progressDate: { type: Date, default: Date.now }, 
        },
    ],
    createDate: {
        type: Date,
        default: Date.now,
    },
});

export default model("User", UserSchema);