import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        },
        minlength: 6
    },
    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    nativeLanguage: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        trim: true,
    },
    location: {
        type: String,
        default: ""
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    authProvider: {
        type: String,
        enum: ["google", "local"],
        default: "local"
    },
    googleId: {
        type: String,
        default: ""
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.password || !this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function (
    enteredPassword
) {
    if (!this.password) return false;

    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};

const User = mongoose.model("User", userSchema)

export default User