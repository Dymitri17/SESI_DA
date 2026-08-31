(function(){
  // background stars
  const starsContainer = document.getElementById('stars');
  const STAR_COUNT = 60;
  for(let i=0;i<STAR_COUNT;i++){
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random()*100 + 'vw';
    s.style.top = Math.random()*100 + 'vh';
    s.style.animationDelay = (Math.random()*3.5) + 's';
    const size = 1 + Math.random()*2;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    starsContainer.appendChild(s);
  }

  const boardEl = document.getElementById('board');
  const statusText = document.getElementById('statusText');
  const winOverlay = document.getElementById('winOverlay');
  const winLine = document.getElementById('winLine');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');

  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let cells = Array(9).fill(null);
  let current = 'X';
  let gameOver = false;
  let scores = {X:0, O:0, D:0};

  const XMARK = `
    <svg viewBox="0 0 100 100" fill="none">
      <g stroke="${'#F2C14E'}" stroke-width="9" stroke-linecap="round">
        <line x1="18" y1="18" x2="82" y2="82"/>
        <line x1="82" y1="18" x2="18" y2="82"/>
      </g>
      <circle cx="50" cy="50" r="6" fill="#F2C14E" opacity=".9"/>
    </svg>`;

  const OMARK = `
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke="#7EC8E3" stroke-width="9"/>
      <ellipse cx="50" cy="50" rx="42" ry="12" stroke="#7EC8E3" stroke-width="4" opacity=".55" transform="rotate(-18 50 50)"/>
    </svg>`;

  function buildBoard(){
    boardEl.innerHTML = '';
    cells.forEach((val, i)=>{
      const btn = document.createElement('button');
      btn.className = 'cell';
      btn.setAttribute('data-i', i);
      btn.setAttribute('aria-label', 'Casa ' + (i+1));
      btn.addEventListener('click', ()=>handleMove(i));
      boardEl.appendChild(btn);
    });
  }

  function handleMove(i){
    if(gameOver || cells[i]) return;
    cells[i] = current;
    renderCell(i);

    const result = checkWinner();
    if(result){
      gameOver = true;
      if(result.winner === 'draw'){
        scores.D++;
        statusText.textContent = 'Empate — o céu ficou equilibrado';
      } else {
        scores[result.winner]++;
        statusText.textContent = (result.winner === 'X' ? 'A estrela venceu!' : 'A lua venceu!');
        drawWinLine(result.combo);
      }
      updateScoreboard();
      return;
    }

    current = current === 'X' ? 'O' : 'X';
    updateStatus();
  }

  function renderCell(i){
    const el = boardEl.querySelector(`[data-i="${i}"]`);
    el.classList.add('filled');
    el.innerHTML = cells[i] === 'X' ? XMARK : OMARK;
    const svg = el.querySelector('svg');
    svg.style.transform = 'scale(0.4)';
    svg.style.opacity = '0';
    svg.style.transition = 'transform .25s cubic-bezier(.2,1.4,.4,1), opacity .2s';
    requestAnimationFrame(()=>{
      svg.style.transform = 'scale(1)';
      svg.style.opacity = '1';
    });
  }

  function checkWinner(){
    for(const combo of WIN_COMBOS){
      const [a,b,c] = combo;
      if(cells[a] && cells[a] === cells[b] && cells[a] === cells[c]){
        return {winner: cells[a], combo};
      }
    }
    if(cells.every(v=>v)) return {winner:'draw'};
    return null;
  }

  function drawWinLine(combo){
    const boardWrap = boardEl.parentElement;
    const wrapRect = boardWrap.getBoundingClientRect();
    winOverlay.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
    winOverlay.setAttribute('width', wrapRect.width);
    winOverlay.setAttribute('height', wrapRect.height);

    const firstCell = boardEl.querySelector(`[data-i="${combo[0]}"]`).getBoundingClientRect();
    const lastCell = boardEl.querySelector(`[data-i="${combo[2]}"]`).getBoundingClientRect();

    const x1 = firstCell.left - wrapRect.left + firstCell.width/2;
    const y1 = firstCell.top - wrapRect.top + firstCell.height/2;
    const x2 = lastCell.left - wrapRect.left + lastCell.width/2;
    const y2 = lastCell.top - wrapRect.top + lastCell.height/2;

    winLine.setAttribute('x1', x1);
    winLine.setAttribute('y1', y1);
    winLine.setAttribute('x2', x2);
    winLine.setAttribute('y2', y2);

    const len = Math.hypot(x2-x1, y2-y1);
    winLine.style.strokeDasharray = len;
    winLine.style.strokeDashoffset = len;
    winLine.style.opacity = '1';
    winLine.style.transition = 'stroke-dashoffset .5s ease-out';
    requestAnimationFrame(()=>{
      winLine.style.strokeDashoffset = 0;
    });
  }

  function updateStatus(){
    statusText.textContent = current === 'X' ? 'Vez da estrela' : 'Vez da lua';
  }

  function updateScoreboard(){
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
  }

  function newRound(){
    cells = Array(9).fill(null);
    current = 'X';
    gameOver = false;
    winLine.style.opacity = '0';
    winLine.style.transition = 'none';
    buildBoard();
    updateStatus();
  }

  document.getElementById('newRoundBtn').addEventListener('click', newRound);
  document.getElementById('resetScoreBtn').addEventListener('click', ()=>{
    scores = {X:0, O:0, D:0};
    updateScoreboard();
    newRound();
  });

  buildBoard();
  updateStatus();
  updateScoreboard();
})();