import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";

export { generateMetadata };

export default function Home() {
  // Game component
  return (
    <main className="flex flex-col items-center gap-4 px-4 grow">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      <div className="flex flex-col items-center gap-2">
        <span id="score" className="text-lg font-medium">Score: 0</span>
        <canvas id="gameCanvas" width={400} height={400} className="border border-gray-300" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const canvas=document.getElementById('gameCanvas');
          const ctx=canvas.getContext('2d');
          const tileSize=20;
          const cols=canvas.width/tileSize;
          const rows=canvas.height/tileSize;
          let snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)},{x:Math.floor(cols/2)-1,y:Math.floor(rows/2)},{x:Math.floor(cols/2)-2,y:Math.floor(rows/2)}];
          let direction='right';
          let food=null;
          let score=0;
          let gameInterval;
          function placeFood(){
            let empty=[];
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
              alert('Game Over! Score: '+score);
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
          placeFood();
          gameInterval=setInterval(()=>{update();draw();},200);
        })();
      ` }} />
    </main>
  );
}
