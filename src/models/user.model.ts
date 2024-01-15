import mongoose,{Schema, Document} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface IUser extends Document {
    username: string,
    fullName: string,
    email: string,
    password: string,
    avatar: string,
    coverImage: string,
    refreshToken: string,
    isPasswordValid : (password: string) => Promise<boolean>,
    generateRefreshToken : () => string,
    generateAccessToken : () => string,
}

const userSchema : Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin", "super-admin"]
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save",async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

userSchema.methods.isPasswordValid = async function(password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({_id: this._id, name: this.name, email: this.email, avater: this.avatar, access: this.accessToken, refresh: this.refreshToken}, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn:  process.env.ACCESS_TOKEN_EXPIRES
    })
}

userSchema.methods.generateRefreshToken = function() {
    return  jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET as string,{
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    })
}


export const userModel = mongoose.model<IUser>("User", userSchema);