import { Router } from "express";
import TarefaControlador from "../controladores/tarefa.controlador";

// Criando a instância do roteador
const router = Router();

// Adicionar as rotas ao roteador
router.get("/v1/tarefas", TarefaControlador.obterTarefas);

router.get("/v1/tarefas/:id", TarefaControlador.obterTarefaPeloID);

router.post("/v1/tarefas", TarefaControlador.registrarTarefa);

router.put("/v1/tarefas/:id", TarefaControlador.atualizarTarefa);

router.delete("/v1/tarefas/:id", TarefaControlador.removerTarefa);

// Exportando o roteador para usar em outro arquivo (app.ts)
export default router;