let scene, camera, renderer;
let move = { forward: false, back: false, left: false, right: false };
let bullets = [];

function startGame() {
  const nome = document.getElementById("nome").value || "Player";
  document.getElementById("menu").style.display = "none";
  document.getElementById("hud").style.display = "block";
  document.getElementById("playerName").innerText = nome;

  init();
  animate();
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.y = 1.6;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("game") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // chão
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial({ color: 0x555555 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // paredes simples (mapa)
  for (let i = 0; i < 10; i++) {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    wall.position.set(Math.random()*20-10, 1, Math.random()*20-10);
    scene.add(wall);
  }

  // luz
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  // controles teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "w") move.forward = true;
    if (e.key === "s") move.back = true;
    if (e.key === "a") move.left = true;
    if (e.key === "d") move.right = true;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "w") move.forward = false;
    if (e.key === "s") move.back = false;
    if (e.key === "a") move.left = false;
    if (e.key === "d") move.right = false;
  });

  // tiro
  document.addEventListener("click", shoot);

  // mouse look
  document.body.requestPointerLock();
  document.addEventListener("mousemove", (e) => {
    camera.rotation.y -= e.movementX * 0.002;
    camera.rotation.x -= e.movementY * 0.002;
  });
}

function shoot() {
  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );

  bullet.position.copy(camera.position);
  bullet.velocity = new THREE.Vector3(0, 0, -1)
    .applyQuaternion(camera.quaternion)
    .multiplyScalar(0.5);

  scene.add(bullet);
  bullets.push(bullet);
}

function update() {
  const speed = 0.1;

  if (move.forward) camera.translateZ(-speed);
  if (move.back) camera.translateZ(speed);
  if (move.left) camera.translateX(-speed);
  if (move.right) camera.translateX(speed);

  bullets.forEach((b, i) => {
    b.position.add(b.velocity);
    if (b.position.length() > 100) {
      scene.remove(b);
      bullets.splice(i, 1);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}