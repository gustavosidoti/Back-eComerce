import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const usersCollection ='users';
const userSchema=new Schema({
    name: String, 
    lastName: String, 
    email: {type: String, unique:true},
    password: String,
    age:Number,
    role: { 
        required: true,
        type: Schema.Types.ObjectId, 
        ref: "roles" 
      },
    github:Boolean,
    githubProfile: Object,
    active:Boolean
},{
  timestamps: true
});

userSchema.plugin(paginate);

userSchema.pre('find',function(){
  this.populate('role');
})

userSchema.pre('findOne',function(){
  this.populate('role');
})

export const userModels=model(usersCollection, userSchema);