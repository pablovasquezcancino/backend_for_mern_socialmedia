import mongoose from "mongoose";


/**  mongo trabaja con esquemas. Creamos una constante llamada UserSchema que va a usar una instansia de la 
 * clase mongoose que trae a su atributo Schema. Le pasamos un objeto en donde guardamos todos los parámetros
 * que tendra nuestro esquema de usuario, en este caso
 * firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: 
    impressions
*/
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true }
);

/** Aquí le pasamos el esquema a nuestro modelo */
const User = mongoose.model("User", UserSchema);
export default User;
