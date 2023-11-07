import React, { useEffect, useRef } from "react";
import './style.css'
function App() {
  const myCanvas = useRef();
  useEffect(() => {
    // myCanvas;
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");

    // ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();

    let rect = c.getContext("2d")
    rect.fillRect(20,20,20,20);
    rect.fillStyle='red';

    ctx.lineWidth = 5;
    ctx.strokeStyle = 'green';
    ctx.strokeRect(100,200,150,100) 
    ctx.fillStyle='green';

    ctx.font='30px Arial';
    ctx.fillStyle ='purple';
    ctx.fillText('Hello World',50,50);
    ctx.fillText('Hello World',100,100);
  }, []);

  return (
    <div className="App">
      <div className="">
      <canvas
        ref={myCanvas}
        className="canvas"
        id="myCanvas"
        width={600}
        height={600}
      ></canvas></div>
    </div>
  );
}

export default App;
