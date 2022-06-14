import React, { useRef, useEffect } from 'react';

/*****
Canvas function used to draw stimulus for the different tests.
Pass the stimulus to draw.
The stimulus item must implement a draw function that takes a canvas context as a parameter.
*/
const Canvas = props => {

  const { stimulus, clickHandler, ...rest } = props;
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

    const onHover = (evt) => {
      const coords = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
      if(stimulus){
        if(stimulus.onMouseMove(coords)){
          canvas.style.cursor = "pointer";
        } else {
          canvas.style.cursor = "auto";
        }
      }
    };

    const onClick = (evt) => {
      const coords = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
      const result = stimulus.onMouseMove(coords);
      clickHandler(result);
    };
    canvas.addEventListener('mousemove', onHover);
    canvas.addEventListener('click', onClick);



    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      if(stimulus){
        stimulus.draw(context);
      }
      animationFrameId = window.requestAnimationFrame(render);
    }
    render();

    return () => {
      canvas.removeEventListener('mousemove', onHover);
      canvas.removeEventListener('click', onClick);
      window.cancelAnimationFrame(animationFrameId);
    }
  }, [stimulus]);

  return <canvas ref={canvasRef} {...rest}/>;
}

export default Canvas;
