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
        <span id="score" className="text-lg font-medium">Score: 0</span>
        <canvas id="gameCanvas" width={400} height={400} className="bg-black border-2 border-white" />
      </div>
      <button id="startBtn" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Start / Restart Game</button>
      <script dangerouslySetInnerHTML={{ __html: `
        let gameInterval;
        let snake;
        let direction;
        let food;
        let score;
        const canvas=document.getElementById('gameCanvas');
        const ctx=canvas.getContext('2d');
        const tileSize=20;
        const cols=canvas.width/tileSize;
        const rows=canvas.height/tileSize;
        function initGame(){
          snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)},{x:Math.floor(cols/2)-1,y:Math.floor(rows/2)},{x:Math.floor(cols/2)-2,y:Math.floor(rows/2)}];
          direction='right';
          score=0;
          document.getElementById('score').textContent='Score: 0';
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
          ctx.fillStyle='black';
          ctx.fillRect(0,0,canvas.width,canvas.height);
          snake.forEach(s=>{
            ctx.fillStyle='green';
            ctx.fillRect(s.x*tileSize,s.y*tileSize,tileSize,tileSize);
          });
          if(food){
            ctx.fillStyle='red';
            ctx.fillRect(food.x*tileSize,food.y*tileSize,tileSize,tileSize);
          }
        }
        function update(){
          const head={...snake[0]};
          if(direction==='right') head.x++;
          if(direction==='left') head.x--;
          if(direction==='up') head.y--;
          if(direction==='down') head.y++;
          if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some(s=>s.x===head.x&&s.y===head.y)){
            clearInterval(gameInterval);
            ctx.fillStyle='white';
            ctx.font='48px sans-serif';
            ctx.textAlign='center';
            ctx.textBaseline='middle';
            ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
            return;
          }
          snake.unshift(head);
          if(food && head.x===food.x && head.y===food.y){
            score++;
            document.getElementById('score').textContent='Score: '+score;
            placeFood();
          }else{
            snake.pop();
          }
        }
        function keyHandler(e){
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
