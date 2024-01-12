import { Request, Response } from "express";
import { Usuario } from "../modelos/usuario.modelo";
import bcrypt from "bcrypt";

// Os controladores são responsáveis por lidar com a lógica da URL.
class UsuarioControlador {
    private usuarios: Usuario[] = [{ id: 1, nome: "William", email: "william@email.com", senha: "123456" }];

    obterUsuarios = (req: Request, res: Response) => {
        // Sanitizando usuários
        /*
        Como funciona o map:
        const numeros = [1, 2, 3, 4]; -> [2, 4, 6, 8]
        []
        [2]
        [2, 4]
        [2, 4, 6]
        [2, 4, 6, 8]
        const numerosDuplicados = numeros.map(numero => numero * 2);
        */
        const usuariosSanitizados = this.usuarios.map(usuario => this.sanitizarDadosUsuario(usuario));
    
        res.json(usuariosSanitizados);
    }

    obterUsuarioPeloID = (req: Request, res: Response) => {
        // Obter o parâmetro da URL
        const id = +req.params.id;
    
        // Buscando o usuário no banco de dados
        const usuario = this.usuarios.find(usuario => usuario.id === id);
    
        // Verificando se o usuário existe
        if (!usuario) {
            res.status(404).json({ message: `O usuário com o ID ${id} não foi encontrado` });
            return;
        }
    
        // Sanitizando dados
        const usuarioSanitizado = this.sanitizarDadosUsuario(usuario);
    
        res.json(usuarioSanitizado);
    }

    registrarUsuario = (req: Request, res: Response) => {
        // Validar os dados do cadastro
        const camposObrigatorios = ["nome", "email", "senha"];
        const camposNaoInformados = camposObrigatorios.filter(campo => !req.body[campo]);
    
        // Verificando se existe campos não informados
        if (camposNaoInformados.length > 0) {
            res.status(400).json({ 
                message: `Parâmetros não informados: ${camposNaoInformados.join(", ")}` 
            });
            return;
        }
    
        // Criando o usuário com os valores do body
        const usuario: Usuario = {
            id: (this.usuarios[this.usuarios.length - 1]?.id ?? 0) + 1,
            nome: req.body.nome,
            email: req.body.email,
            senha: this.criptografarSenha(req.body.senha)
        };
    
        // Adicionando usuário no banco de dados
        this.usuarios.push(usuario);
    
        // Sanitizando usuário
        const usuarioSanitizado = this.sanitizarDadosUsuario(usuario);
    
        // Retornando o usuário criado
        res.status(201).json(usuarioSanitizado);
    }

    atualizarUsuario = (req: Request, res: Response) => {
        // Obtendo o ID da rota
        const id = +req.params.id;
    
        // Encontrando a posição do usuário no vetor
        const indiceUsuario = this.usuarios.map(usuario => usuario.id).indexOf(id);
    
        // Verificando se o usuário não existe
        if (indiceUsuario === -1) {
            res.status(404).json({ message: `O usuário com o ID ${id} não foi encontrado` });
            return;
        }
    
        // Validar os dados do cadastro
        const camposObrigatorios = ["nome", "email"];
        const camposNaoInformados = camposObrigatorios.filter(campo => !req.body[campo]);
    
        // Verificando se existe campos não informados
        if (camposNaoInformados.length > 0) {
            res.status(400).json({ 
                message: `Parâmetros não informados: ${camposNaoInformados.join(", ")}` 
            });
            return;
        }
    
        // Criando o usuário com os dados do body
        const usuario: Usuario = {
            id,
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        };
    
        // Verificando se a senha será atualizada
        if (usuario.senha) {
            usuario.senha = this.criptografarSenha(usuario.senha); // Se a senha for atualizada é necessário criptografar
        } else {
            usuario.senha = this.usuarios[indiceUsuario].senha; // Se não for, usar a senha que já está cadastrada no BD
        }
    
        // Verificando se o email já está cadastrado
        const usuarioComEmailJaCadastrado = this.usuarios.find(u => u.email = usuario.email);
    
        if (usuarioComEmailJaCadastrado && usuarioComEmailJaCadastrado.id !== usuario.id) {
            res.status(409).json({ message: `O e-mail '${usuario.email}' já está sendo utilizado` });
            return;
        }
    
        // Atualizando o usuário no banco de dados
        this.usuarios[indiceUsuario] = usuario;
    
        // Removendo os dados sensíveis da resposta
        const usuarioSanitizado = this.sanitizarDadosUsuario(usuario);
    
        res.json(usuarioSanitizado);
    }

    removerUsuario = (req: Request, res: Response) => {
        // Obtendo o ID da rota
        const id = +req.params.id;
    
        // Encontrando a posição do usuário no vetor
        const indiceUsuario = this.usuarios.map(usuario => usuario.id).indexOf(id);
    
        // Verificando se o usuário não existe
        if (indiceUsuario === -1) {
            res.status(404).json({ message: `Usuário com o ID ${id} não foi encontrado` });
            return;
        }
    
        // Removendo o usuário do banco
        this.usuarios.splice(indiceUsuario, 1);
    
        res.status(204).end();
    }

    private sanitizarDadosUsuario = (usuario: Usuario) => {
        const { senha, ...usuarioSanitizado } = usuario;
        return usuarioSanitizado;
    }

    private criptografarSenha = (senha: string) => {
        // npm i bcrypt
        // npm i -D @types/bcrypt
        return bcrypt.hashSync(senha, 10);
    };
}

// Padrão Singleton
export default new UsuarioControlador