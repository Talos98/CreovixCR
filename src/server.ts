import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { AppRoutes } from "./routes/routes";
import path from "path/win32"
import { ErrorMiddleware } from "./middlewares/error.middleware";


const app = express();
// Acceder a la configuracion del archivo .env
dotenv.config();
// Puerto que escucha por defecto 300 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servido
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(morgan("dev"));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);


// Definited routes
app.use(AppRoutes.routes);

//Hnadler errors middleware

app.use(ErrorMiddleware.handleError)

// Access to Images
app.use("/images",express.static(
    path.join(path.resolve(),"assets/uploads")))



app.get("/", (req, res) => {
    res.json({
        message: "API de creovixcr funcionando correctamente",
    });
});
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log("Presione CTRL-C para detenerlo\n");
});