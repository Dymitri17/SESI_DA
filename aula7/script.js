function login(){

    const local_nome = localStorage.getItem("nome");
    const local_senha = localStorage.getItem("senha")

    const nome  = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if(nome == local_nome && senha == local_senha){
        alert("Login realizado com sucesso");
    }else{
        alert("Nome inválido");
    }
}
