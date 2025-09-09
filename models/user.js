const mongoose = require("mongoose");
const user_schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    salt: { type: String, required: true , default: "" },
    pic :{type:String, default:"https://thumbs.dreamstime.com/b/user-icon-male-avatar-business-suit-vector-flat-design-businessman-man-internet-rounded-shape-web-mobile-element-profile-99280834.jpg"},
    bio: { type: String, max: 250, default: "Hey there! I am using JanSetu." },
    notifications: { type: [String], default: [] } // ✅ Array of strings
}
, { timestamps: true});
const User = mongoose.model("User", user_schema);
module.exports = User;