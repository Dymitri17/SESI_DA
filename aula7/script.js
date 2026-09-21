function Login(){

    const local_nome = localStorage.getItem("nome");
    const local_senha = localStorage.getItem("senha")

    const nome  = document.getElementById("nome");
    const senha = document.getElementById("senha");

    if(nome == local_nome){
        aler("Login realizado com sucesso");
    }else{
        alert("Nome inválido");
    }

    alert(nome.value + " " + senha.value);
}
