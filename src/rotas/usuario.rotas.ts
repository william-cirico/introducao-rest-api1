import { Router } from "express";
import UsuarioControlador from "../controladores/usuario.controlador";

// Criando a instância do roteador
const router = Router();

// Adicionar as rotas ao roteador
router.get("/v1/usuarios", UsuarioControlador.obterUsuarios);

router.get("/v1/usuarios/:id", UsuarioControlador.obterUsuarioPeloID);

router.post("/v1/usuarios", UsuarioControlador.registrarUsuario);

router.put("/v1/usuarios/:id", UsuarioControlador.atualizarUsuario);

router.delete("/v1/usuarios/:id", UsuarioControlador.removerUsuario);

// Exportando o roteador para usar em outro arquivo (app.ts)
export default router;