import React, { useRef, useEffect } from 'react';

/*****
Canvas function used to draw stimulus for the different tests.
Pass the stimulus to draw.
The stimulus item must implement a draw function that takes a canvas context as a parameter.
*/
const StaticCanvas = props => {

  const { stimulus, ...rest } = props;
  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    // This is for desktop / laptop browsers. We strictly adhere to 800*600 canvas size.
    canvas.width = 1600;
    canvas.height = 1200;
    canvas.style.width = "800px";
    canvas.style.height = "600px";
    canvas.getContext('2d').scale(2,2);

    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      if(stimulus && frameCount < 16){
        stimulus.draw(context);
        animationFrameId = window.requestAnimationFrame(render);
      }
    }
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [stimulus]);

  return <canvas ref={canvasRef} {...rest}/>;
}

export default StaticCanvas;
