import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { AppRoutes } from "./routes/routes";
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

app.use('/api', AppRoutes.routes);

// Handler errors middleware
app.use(ErrorMiddleware.handleError);

// Access to Images
app.use("/uploads", express.static(
    path.join(path.resolve(), "assets/uploads")));

app.get("/", (req, res) => {
    res.json({
        message: "API de creovixcr funcionando correctamente",
    });
});
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log("Presione CTRL-C para detenerlo\n");
});