import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
/**Importaciones de las rutas. importamos los archivos donde se establecen las rutas de auth, users y posts */
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
/** importamos el controlador de autenticación. El de registrarse y el de crear un post */
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";

/* CONFIGURATIONS  -- Aquí van todas las configuraciones de middelware y de paquetes. Los middelware son algo que corre
entre diferentes epticiones o request. Básicamente funciones que corren entre distintas

Los middlewares son códigos que se ejecutan antes de que una petición HTTP llegue al manejador de rutas o antes 
de que un cliente reciba una respuesta, lo que da al framework la capacidad de ejecutar un script 
típico antes o después de la petición de un cliente.
*/


/** Esto debemos ponerlo cuando usamos 'type': 'module' en nuestro package.json */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

/* Configuraciones para usar express y los paquetes que instalamos  */ 
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE. Configuración para usar multer y el manejo de guardar archivos */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });

  /* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
/**usamos el verify token para proteger esta ruta, para que solo usuarios registardos y autorizados puedan visitarla
 * establecimos este verifytoken en el archivo auth.js que esta en la carpeta middleware
 */
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


  /* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
