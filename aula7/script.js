function cadastrar(){
  let usuario = document.getElementById("novoUsuario").value;
  let senha = document.getElementById("novaSenha").value;

  if(usuario === "" || senha === ""){
    alert("Preencha tudo!");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  for(let i = 0; i < usuarios.length; i++){
    if(usuarios[i].usuario === usuario){
      alert("Usuário já existe!");
      return;
    }
  }

  usuarios.push({usuario, senha});
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  localStorage.setItem("nome", usuario);
  localStorage.setItem("senha", senha);

  alert("Cadastrado com sucesso!");
}


function login(){ 
 
    const local_nome = localStorage.getItem("nome"); 
    const local_senha = localStorage.getItem("senha"); 
 
    const nome  = document.getElementById("usuario").value; 
    const senha = document.getElementById("senha").value; 
 
    if(nome == local_nome && senha == local_senha){ 
        alert("Login realizado com sucesso"); 
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    for(let i = 0; i < usuarios.length; i++){
      if(nome == usuarios[i].usuario && senha == usuarios[i].senha){
        alert("Login realizado com sucesso");
        return;
      }
    }

    alert("Nome inválido"); 
} 


function recuperar(){
  let nome = document.getElementById("usuarioRec").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  for(let i = 0; i < usuarios.length; i++){
    if(nome == usuarios[i].usuario){
      document.getElementById("resposta").innerText =
        "Senha: " + usuarios[i].senha;
      return;
    }
  }

  let local_nome = localStorage.getItem("nome");
  let local_senha = localStorage.getItem("senha");

  if(nome == local_nome){
    document.getElementById("resposta").innerText =
      "Senha: " + local_senha;
    return;
  }

  document.getElementById("resposta").innerText =
    "Usuário não encontrado!";
}