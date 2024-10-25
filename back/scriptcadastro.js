// cadastrar usuarios

async function cadastrar(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = {
        nome,
        email,
        senha
    }

    console.log(data);
    try {
        const response = await fetch('http://localhost:3001/usuarios/cadastrar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const results = await response.json();

        if (results.success) {
            console.log(results)
            alert(results.message)
        } else {
            alert(results.message)
        }
    }
    catch (error) {
        console.log(error);
    }
}

async function logar(event) {
    event.preventDefault();

    const nome = document.getElementById('nome_login').value;
    const senha = document.getElementById('senha_login').value;

    const data = { nome, senha };
    console.log(data);

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let results = await response.json();

        if (results.success) {
            let usuarioData = results;

            localStorage.setItem('informacoes', JSON.stringify(usuarioData));

            let html = document.getElementById('informacoes');
            let dados = JSON.parse(localStorage.getItem('informacoes'));
            console.log(dados);
            let perfil = dados.data.perfil;

            html.innerHTML = `<div style="display: block; flex-direction: column; align-items:end">
            id: ${dados.data.id}, nome: ${dados.data.nome}, email: ${dados.data.email}, perfil: ${dados.data.perfil}
            </div>`;
            html.style.display = "block";

        } else {
            alert(results.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao se conectar ao servidor.");
    }
}

// verificar se o usuário está logado ao carregar a página
window.addEventListener("load", () => {
    listarProdutos()

    if (localStorage.getItem("informacoes")) {
        let html = document.getElementById('informacoes');
        let dados = JSON.parse(localStorage.getItem('informacoes'));

        if (dados.data.perfil === "admin") {
            document.getElementById('informacoes').style.display = 'block';
        } else {
            document.getElementById('informacoes').style.display = 'none';
        }

        html.innerHTML = `<div style="display: block; flex-direction: column; align-items:end">
            id: ${dados.data.id}, nome: ${dados.data.nome}, email: ${dados.data.email}, perfil: ${dados.data.perfil}
            </div>`;
            html.style.display = "block";
    }
})

// função de logout (descomentada para uso)

function sairdaconta(event) {
    console.log(informacoes)
    localStorage.removeItem('informacoes');
    window.location.href = "indexformulario.html";
};

// editar usuarios 

async function editar(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = {
        nome,
        email,
        senha
    }

    console.log(data);

    const response = await fetch('http://localhost:3001/usuario/editar/:id', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        console.log(results)
        alert(results.message)
    } else {
        alert(results.message)
    }
}

// deletar usuarios

async function deletar(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = {
        nome,
        email,
        senha
    }

    console.log(data);

    const response = await fetch('http://localhost:3001/usuario/deletar/:id', {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        console.log(results)
        alert(results.message)
    } else {
        alert(results.message)
    }
}

// para os produtos 

async function cadastrarProduto(event) {
    event.preventDefault();

    const nome = document.getElementById('nome_produto').value;
    const quantidade = Number(document.getElementById('quantidade').value);
    const preco = Number(document.getElementById('preco').value);
    const file = document.getElementById('file').files[0];

    let formData = new FormData();
    formData.append('nome', nome);
    formData.append('quantidade', quantidade);
    formData.append('preco', preco);
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3001/produto/cadastrar', {
            method: "POST",
            body: formData 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar produto.");
        }

        const results = await response.json();

        if (results.success) {
            console.log(results);
            alert(results.message);
        } else {
            alert(results.message);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro: " + error.message);
    }
}

// listar os produtos 

async function listarProdutos(event) {
    const response = await fetch('http://localhost:3001/produtos/listar', {
        method: "GET",
        headers: {
            "content-type": "application/json"
        } 
    })


    const results = await response.json()

    if (results.success) {
        let produtoData = results.data
        const images = 'http://localhost:3001/uploads/'
        let html = document.getElementById('card_produto')
        
        produtoData.forEach(produto => {
            console.log(produto)
            let card = `
            <div class="produtos-catalago" id="card_produto">
                <div class="produtos-catalago-adm">
                    <button onclick="deletarProduto(1)"><img src="./assets/lixeira (1).png" alt="" class="lixeira"></button>
                    <img src="./assets/lapis.png" alt="" class="lapis"> 
                </div> 
                <a href="./produto1.html">
                    <div class="produtos-catalago-imagem">
                        <img src="${images + produto.image}" alt="" class="imgs-catalago-principal">
                    </div>
                </a>
                <div class="produtos-catalago-texto">
                    <h3>${produto.nome_produto}</h3>
                    <h3>Valor: ${produto.preco}</h3>
                </div>
                <button onclick="formEditarProduto(${JASON.stringify(produto)})">Editar</button>
            </div>
            `
            html.innerHTML += card

        })
    } else {
        alert(results.message)
    }

}


function formEditarProduto(produto) {
    console.log(produto)
    let images = "http://localhost:3001/uploads/"
    let modal = document.getElementById('editar_produto')
 
    document.getElementById('id_produto').value = produto.id
    document.getElementById('editar_titulo').value = produto.titulo
    document.getElementById('editar_preco').value = produto.price
    document.getElementById('imagem_produto').src = images + produto.image
 
    modal.style.display = "block"
}
 
async function atualizarProduto(event) {
    event.preventDefault()
 
    let id = document.getElementById('id_produto').value
    let titulo = document.getElementById('editar_nome').value
    let preco = document.getElementById('editar_preco').value 
    let file = document.getElementById('editar_imagem').files[0]

    let formData = new FormData();
 
    formData.append('nome', nome)
    formData.append('preco', preco)
    formData.append('file', file)
 
    console.log(formData.get('nome'), formData.get('preco'), formData.get('file'), id)
    const response = await fetch(`http://localhost:3001/produto/editar/${id}`, {
        method: "PUT",
        body: formData
    })
 
    const results = await response.json()
 
    if(results.succes) {
        alert(results.message)
    } else {
        alert(results.message)
    }
}




// aparecer o produto no html //

// async () => {
//     const listar = getElementById('produtos-catalago')

//     const response = await fetch('http://localhost:3001/produto/listar')
//     const result = await response.json();

//     if (result.success) {
//         const produtos = result.data;
//         produtos.forEach(produtos => {
//             const productDiv = document.createElement('div');
//             productDiv.className = 'produtos-catalago';
//             productDiv.dataset.productId = produtos.id_produtos; // Adiciona um ID único ao elemento

//             productDiv.innerHTML = `
//                 <img src="${produtos.image_link}" alt="${produtos.produtos_nome}">
//                 <div class="produtos-nome">${produtos.produtos_nome}</div>
//                 <div class="produtos-preco">R$ ${produtos.preco}</div>
//             `;

//             productDiv.addEventListener('click', () => {
//                 window.location.href = `produtos-details.html?id=${produtos.id_produtos}`; 
//             });

//             productList.appendChild(productDiv);
//         });
//     }
// }

// deletar o produto

async function deletarProduto(produtoId) {
    try {
        let response = await fetch('http://localhost:3001/produto/id:', {
            method: "DELETE"
        });
 
        let results = await response.json();
 
        if (results.success) {
            alert(results.message);
 
            let linha_produto = document.getElementById(`produto-${produtoId}`);
            if (linha_produto) {
                linha_produto.remove(); 
            }
        } else {
            alert(results.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao se conectar ao servidor.");
    }
}