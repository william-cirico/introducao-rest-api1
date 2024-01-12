import app from "./conf/app";
import { AppDataSource } from "./conf/database";

AppDataSource.initialize()
    .then(() => {
        // Definir a porta da API
        const PORTA = 8080;

        // Rodando o servidor
        app.listen(PORTA, () => {
            console.log(`O servidor de desenvolvimento está rodando em: http://localhost:${PORTA}`);
        });
    })
    .catch(console.error)
