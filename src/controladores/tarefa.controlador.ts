import { Request, Response } from "express";
import { Tarefa } from "../modelos/tarefa.modelo";
import { Usuario } from "../modelos/usuario.modelo";

class TarefaControlador {
    private tarefas: Tarefa[] = [];
    private usuarios: Usuario[] = [{ id: 1, nome: "William", email: "william@email.com", senha: "123456" }];

    obterTarefas = (req: Request, res: Response) => {
        res.json(this.tarefas);
    }

    obterTarefaPeloID = (req: Request, res: Response) => {
        // Obter o parâmetro da URL
        const id = +req.params.id;

        // Buscando o tarefa no banco de dados
        const tarefa = this.tarefas.find(tarefa => tarefa.id === id);

        // Verificando se o tarefa existe
        if (!tarefa) {
            res.status(404).json({ message: `A tarefa com o ID ${id} não foi encontrada` });
            return;
        }

        res.json(tarefa);
    }

    registrarTarefa = (req: Request, res: Response) => {
        // Validar os dados do cadastro
        const camposObrigatorios = ["nome", "descricao", "dataConclusao", "dataPrevistaConclusao", "usuarioId"];
        const camposNaoInformados = camposObrigatorios.filter(campo => !req.body[campo]);

        // Verificando se existe campos não informados
        if (camposNaoInformados.length > 0) {
            res.status(400).json({
                message: `Parâmetros não informados: ${camposNaoInformados.join(", ")}`
            });
            return;
        }

        // Verificando se o usuário existe
        const usuarioId = req.body.usuarioId;

        // Buscando o usuário no banco de dados
        const usuario = this.usuarios.find(usuario => usuario.id === usuarioId);

        // Verificando se o usuário existe
        if (!usuario) {
            res.status(404).json({ message: `O usuário com o ID ${usuarioId} não foi encontrado` });
            return;
        }

        // Criando o usuário com os valores do body
        const tarefa: Tarefa = {
            id: (this.tarefas[this.tarefas.length - 1]?.id ?? 0) + 1,
            nome: req.body.nome,
            descricao: req.body.descricao,
            dataConclusao: req.body.dataConclusao,
            dataPrevistaConclusao: req.body.dataPrevistaConclusao,
            usuarioId: req.body.usuarioId
        };

        // Adicionando usuário no banco de dados
        this.tarefas.push(tarefa);

        // Retornando o usuário criado
        res.status(201).json(tarefa);
    }

    atualizarTarefa = (req: Request, res: Response) => {
        // Obtendo o ID da rota
        const id = +req.params.id;

        // Encontrando a posição da tarefa no vetor
        const indiceTarefa = this.tarefas.map(tarefa => tarefa.id).indexOf(id);

        // Verificando se a tarefa não existe
        if (indiceTarefa === -1) {
            res.status(404).json({ message: `A tarefa com o ID ${id} não foi encontrado` });
            return;
        }

        // Validar os dados do cadastro
        const camposObrigatorios = ["nome", "descricao", "dataConclusao", "dataPrevistaConclusao", "usuarioId"];
        const camposNaoInformados = camposObrigatorios.filter(campo => !req.body[campo]);

        // Verificando se existe campos não informados
        if (camposNaoInformados.length > 0) {
            res.status(400).json({
                message: `Parâmetros não informados: ${camposNaoInformados.join(", ")}`
            });
            return;
        }

        // Criando a tarefa com os dados do body
        const tarefa: Tarefa = {
            id,
            nome: req.body.nome,
            descricao: req.body.descricao,
            dataConclusao: req.body.dataConclusao,
            dataPrevistaConclusao: req.body.dataPrevistaConclusao,
            usuarioId: req.body.usuarioId
        };

        // Atualizando a tarefa no banco de dados
        this.tarefas[indiceTarefa] = tarefa;

        res.json(tarefa);
    }

    removerTarefa = (req: Request, res: Response) => {
        // Obtendo o ID da rota
        const id = +req.params.id;
    
        // Encontrando a posição da tarefa no vetor
        const indiceTarefa = this.tarefas.map(tarefa => tarefa.id).indexOf(id);
    
        // Verificando se a tarefa não existe
        if (indiceTarefa === -1) {
            res.status(404).json({ message: `Tarefa com o ID ${id} não foi encontrado` });
            return;
        }
    
        // Removendo a tarefa do banco
        this.tarefas.splice(indiceTarefa, 1);
    
        res.status(204).end();
    }
}

export default new TarefaControlador;