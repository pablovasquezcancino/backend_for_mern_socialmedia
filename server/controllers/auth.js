import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

/* REGISTER USER */
/** Con esta función register registramos ususarios de manera asincrona, ya que trabajamos con una base de datos.
 * los métos req y res vienen por defecto desde express y refiren al rquest qeu ahce el fonrtend y a la response que 
 * le envia el back
 */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    /**  Esto lo ponemos para encriptar las contraseñas, usando bcrypt */
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    /**Aquí instanciamos en una constante newUser nuestra clase User. Le pasamos un objeto con 
     * todos sus parámetros
     */
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  /* LOGGING IN 
  En esta función establecemos la lógica del login. Se validan las credenciales qeu nos pone para logearse.
  */
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      /**Aquí usamos la funcion findOne para encontrar el email ingresado en la base de datos.
       * si el mail del usuario no existe responde un mensaje "User does not exist. "
       */
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      /**Aqui usamos bcrypt para comparar la contraseña que se ingreso en el login con la contraseña 
       * guardada en la base de datos
       */
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  