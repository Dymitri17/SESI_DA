function cadastro() {

    let nome = document.getElementById("nome").value;
    let usuario = document.getElementById("usuario").value;
    let senha = document.getElementById("senha").value;
    let palavra = document.getElementById("palavra").value;

    if(nome === "" || usuario === "" || senha === "" || palavra === ""){
        alert("Preencha todos os campos!");
        return;
    }

    localStorage.setItem("NOME", nome);
    localStorage.setItem("USUARIO", usuario);
    localStorage.setItem("SENHA", senha);
    localStorage.setItem("PALAVRA", palavra);

    alert("Cadastro realizado!");

    window.location.href = "index.html";
}


function recuperar_senha() {



    let nome = document.getElementById("nomeRec").value
    ;
    let palavra = document.getElementById("palavraRec")
    .value;


    let nomeSalvo = localStorage.getItem("NOME");

    let palavraSalva = localStorage.getItem("PALAVRA");

    let senhaSalva = localStorage.getItem("SENHA");



    let tentativas = localStorage.getItem("tentativas")
     || 0;
    tentativas = parseInt(tentativas);


    if(tentativas >= 3){
        alert("Bloqueado!");
        document.getElementById("nomeRec").disabled = true;
        document.getElementById("palavraRec").disabled = true;
        return;
    }

    if(nome === nomeSalvo && palavra === palavraSalva){
        alert("Senha: " + senhaSalva);
        localStorage.setItem("tentativas", 0);
    }else{
        tentativas++;
        localStorage.setItem("tentativas", tentativas);

        alert("Erro " + tentativas + "/3");

        document.getElementById("nomeRec").value = "";
        document.getElementById("palavraRec").value = "";

        if(tentativas >= 3){
            alert("Bloqueado!");
            document.getElementById("nomeRec").disabled = true;
            document.getElementById("palavraRec").disabled = true;
        }
    }
}
function login(){ 
 
    const local_usuario = localStorage.getItem("USUARIO"); 
    const local_senha = localStorage.getItem("SENHA"); 
 
    const usuario  = document.getElementById("usuario").value; 
    const senha = document.getElementById("senha").value; 
 
    if(usuario == local_usuario && senha == local_senha){ 
        alert("Login realizado com sucesso"); 
    }else{ 
        alert("Usuário ou senha inválidos"); 
    } 
}