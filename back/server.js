// Importar pacotes para a aplicação
const express = require('express');
const cors = require('cors');
const upload = require('multer')
// Definir a porta do express e instanciar o express
const porta = 3001;
const app = express();
// Habilitar o cors e utilização de JSON
app.use(cors());
app.use(express.json())
// Testar API
app.listen(porta, () => console.log(`Rodando na porta ${porta}`));
// Importar a conexão com o banco
const connection = require('./db_config');

//swagger
// arquivo app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Define a configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuários',
            version: '1.0.0',
            description: 'Documentação da API de Usuários',
        },
    },
    apis: ['./server*.js'], // Caminho para os arquivos com anotações Swagger
};

// Inicializa o Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Define a rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de exemplo
app.get('/users', (req, res) => {
    // Lógica para retornar a lista de usuários
    const users = [
        { id: 1, name: 'João' },
        { id: 2, name: 'Maria' },
    ];
    res.json(users);
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});



// Rotas //

// usuários //


app.post('/usuarios/cadastrar', (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.email,
        request.body.senha
    );
    let query = "INSERT INTO usuarios(nome, email, senha) VALUES (?,?,?)";
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(201).json({
                success: true,
                message: "Sucesso",
                data: results
            });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Sem sucesso",
                    data: err
                });
        }
    });

});

/**
* @swagger
* /users: cadastrar
*   get: post
*     summary: Retorna a lista de usuários
*     responses:
*       200:
*         description: Lista de usuários
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*/


app.get('/usuario/listar', (request, response) => {
    let query = "SELECT * FROM usuarios";
    connection.query(query, (err, results) => {
        if (results) {
            response.status(201).json({
                success: true,
                message: "Sucesso",
                data: results
            });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Sem sucesso",
                    data: err
                });
        }
    });
});

app.delete('/usuario/deletar/:id', (request, response) => {
    let params = Array(
        request.params.id
    )
    let query = "DELETE FROM usuarios WHERE id = (?)";
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(201).json({
                success: true,
                message: "Sucesso",
                data: results
            });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Sem sucesso",
                    data: err
                });
        }
    });
})

app.put('/usuario/editar/:id', (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.email,
        request.body.senha,
        request.params.id
    )

    let query = "UPDATE usuarios SET  nome = (?), email = (?), senha = (?) WHERE id = (?)"
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(201).json({
                success: true,
                message: "Sucesso",
                data: results
            });
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Sem sucesso",
                    data: err
                });
        }
    });
})

app.post('/login', (request, response) => {
    let params = Array(
        request.body.nome
    )
    let query = "SELECT id,nome,email,senha,perfil FROM usuarios WHERE nome = ?";

    connection.query(query, params, (err, results) => {
        if (results.length > 0) {
            let senhaDigita = request.body.senha
            let senhaBanco = results[0].senha

            if (senhaBanco === senhaDigita) {

                response
                    .status(200)
                    .json({
                        success: true,
                        message: "Sucesso",
                        data: results[0]
                    })
            } else {
                response
                    .status(400)
                    .json({
                        success: false,
                        message: "Verifique sua senha!"
                    })
            }
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Nome não cadastrado!"
                })
        }

        response
            .status(200)
            .json({
                success: true,
                message: "Sucesso"
            })
    })

})

// produtos //

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/'); // Diretório onde a imagem será salva
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname) // Nome único para evitar conflitos
    }
})

const upload = multer({ storage: storage })


app.post('/produto/cadastrar', upload.single('file'), (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.quantidade,
        request.body.preco,
        request.file.filename
    )
    const query = "INSERT INTO produtos(nome, quantidade, preco, image) VALUES (?, ?, ?, ?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            return response.status(400).json({
                success: false,
                message: "Erro ao inserir produto no banco de dados.",
                error: err
            });
        }

        return response.status(201).json({
            success: true,
            message: "Produto cadastrado com sucesso!",
            data: { id: results.insertId }
        });
    });
});

app.use('/uploads', express.static(__dirname + '\\public'))

app.get('produtos/listar', (request, response) => {
    let query = "SELECT * FROM produtos"

    connection.query(query, (err, results) => {
        if (results) {
            response
                .status(200)
                .json({
                    success: true,
                    message: "sucesso",
                    data: results[0]
                })
        } else {
            response
                .status(200)
                .json({
                    success: false,
                    message: "sem sucesso",
                    data: results[0]
                })
        }
    })

})

app.delete('/produto/deletar/id:', (request, response) => {
    let params = Array(
        request.params.id
    )
    let query = "DELETE FROM produtos WHERE id = (?)"
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(201).json({
                success: true,
                message: "Sucesso",
                data: results
            })
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Sem sucesso",
                    data: err
                })
        }
    })
})

app.put('/produto/editar/:id', upload.single('file'), (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.preco,
        request.file.filename,
        request.params.id
    )

    let query = "UPDATE produtos SET  nome = (?), preco = (?), image = (?) WHERE id = (?)"
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(201).json({
                success: true,
                message: "Sucesso",
                data: results
            })
        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Sem sucesso",
                    data: err
                })
        }
    });
})







