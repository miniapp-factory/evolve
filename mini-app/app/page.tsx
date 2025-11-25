import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";

export { generateMetadata };

export default function Home() {
  // Game component
  return (
    <main className="flex flex-col items-center gap-4 px-4 grow bg-gray-800">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <div className="flex flex-col items-center gap-2">
        <div id="scorePanel" className="text-white text-lg font-semibold">SCORE: <span id="score">0</span></div>
        <canvas id="gameCanvas" width={400} height={400} className="bg-black border-2 border-white rounded-lg shadow-inner" />
      </div>
      <button id="startBtn" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Start / Restart Game</button>
      <script dangerouslySetInnerHTML={{ __html: `
        let gameInterval;
        let snake;
        let direction;
        let food;
        let score;
        let gameOver=false;
        let finalScore=0;
        let fade=0;
        const canvas=document.getElementById('gameCanvas');
        const ctx=canvas.getContext('2d');
        const tileSize=20;
        const cols=canvas.width/tileSize;
        const rows=canvas.height/tileSize;
        function initGame(){
          snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)},{x:Math.floor(cols/2)-1,y:Math.floor(rows/2)},{x:Math.floor(cols/2)-2,y:Math.floor(rows/2)}];
          direction='right';
          score=0;
          gameOver=false;
          fade=0;
          finalScore=0;
          document.getElementById('score').textContent='0';
          placeFood();
        }
        function placeFood(){
          const empty=[];
          for(let y=0;y<rows;y++){
            for(let x=0;x<cols;x++){
              if(!snake.some(s=>s.x===x&&s.y===y)){
                empty.push({x,y});
              }
            }
          }
          food=empty[Math.floor(Math.random()*empty.length)];
        }
        function draw(){
          // grid
          ctx.fillStyle='black';
          ctx.fillRect(0,0,canvas.width,canvas.height);
          ctx.strokeStyle='rgba(255,255,255,0.1)';
          ctx.lineWidth=1;
          for(let i=0;i<=cols;i++){
            ctx.beginPath();
            ctx.moveTo(i*tileSize,0);
            ctx.lineTo(i*tileSize,canvas.height);
            ctx.stroke();
          }
          for(let j=0;j<=rows;j++){
            ctx.beginPath();
            ctx.moveTo(0,j*tileSize);
            ctx.lineTo(canvas.width,j*tileSize);
            ctx.stroke();
          }
          // snake
          ctx.shadowColor='rgba(0,255,0,0.6)';
          ctx.shadowBlur=10;
          snake.forEach(s=>{
            const x=s.x*tileSize+tileSize/2;
            const y=s.y*tileSize+tileSize/2;
            const r=tileSize/2-2;
            ctx.beginPath();
            ctx.arc(x,y,r,0,Math.PI*2);
            ctx.fillStyle='green';
            ctx.fill();
          });
          ctx.shadowBlur=0;
          // food
          const pulse=Math.sin(Date.now()/500)*0.3+1;
          const r=tileSize/2-2;
          ctx.beginPath();
          ctx.arc(food.x*tileSize+tileSize/2, food.y*tileSize+tileSize/2, r*pulse, 0, Math.PI*2);
          ctx.fillStyle='red';
          ctx.shadowColor='rgba(255,0,0,0.6)';
          ctx.shadowBlur=10;
          ctx.fill();
          ctx.shadowBlur=0;
          // game over overlay
          if(gameOver){
            ctx.fillStyle='rgba(0,0,0,0.5)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='white';
            ctx.font='48px sans-serif';
            ctx.textAlign='center';
            ctx.textBaseline='middle';
            ctx.globalAlpha=Math.min(fade,1);
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 30);
            ctx.font='32px sans-serif';
            ctx.fillText('Score: '+finalScore, canvas.width/2, canvas.height/2 + 20);
            fade+=0.02;
          }
        }
        function update(){
          if(gameOver) return;
          const head={...snake[0]};
          if(direction==='right') head.x++;
          if(direction==='left') head.x--;
          if(direction==='up') head.y--;
          if(direction==='down') head.y++;
          if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some(s=>s.x===head.x&&s.y===head.y)){
            clearInterval(gameInterval);
            gameOver=true;
            finalScore=score;
            return;
          }
          snake.unshift(head);
          if(food && head.x===food.x && head.y===food.y){
            score++;
            document.getElementById('score').textContent=score;
            placeFood();
          }else{
            snake.pop();
          }
        }
        function keyHandler(e){
          if(gameOver) return;
          const key=e.key;
          if(key==='ArrowUp'&&direction!=='down') direction='up';
          if(key==='ArrowDown'&&direction!=='up') direction='down';
          if(key==='ArrowLeft'&&direction!=='right') direction='left';
          if(key==='ArrowRight'&&direction!=='left') direction='right';
        }
        document.addEventListener('keydown',keyHandler);
        document.getElementById('startBtn').addEventListener('click',()=>{
          if(gameInterval) clearInterval(gameInterval);
          initGame();
          gameInterval=setInterval(()=>{update();draw();},200);
        });
      ` }} />
    </main>
  );
}
