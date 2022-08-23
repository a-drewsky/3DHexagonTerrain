import React, { useState, useRef, useEffect } from 'react'
import { Row, Form, Button } from 'react-bootstrap'

import GameMainClass from '../exampleGameFramework/GameMainClass';

import ImagesClass from '../exampleGameFramework/GameImages';

const ContentPanel = () => {

   //SETUP
   const canvas = useRef(null);

   const [gameClass, setGameClass] = useState(null);

   const [gameImages, setGameImages] = useState(new ImagesClass());

   const [winCondition, setWinCondition] = useState(null);

   const [imagesLoaded, setImagesLoaded] = useState(false);
   //END SETUP


   //SETTINGS
   const [sizeSetting, setSize] = useState('small');
   //END SETTINGS


   //CREATE NEW GAME METHOD
   const startNewGame = (e) => {
      e.preventDefault();
      if(gameClass && !gameClass.loaded) return;

      if (gameClass) gameClass.clear();
      setGameClass(undefined);
      let newGameClass = new GameMainClass(
         canvas.current,
         gameImages,
         setWinCondition,
         {
            mapSize: sizeSetting
         }
      );

      setGameClass(newGameClass);
      newGameClass.createGame();

      setWinCondition(null);
   }
   //END CREATE NEW GAME METHOD

   const log = () => {
      console.log("loaded")
      setImagesLoaded(true)
   }


   useEffect(() => {
      gameImages.loadImages(log);
   }, [gameImages])

   useEffect(() => {
      document.addEventListener('keypress', e => keyPress(e))
  }, [gameClass])


   //INPUTS
   const mouseDown = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if(gameClass && gameClass.loaded) gameClass.mouseDown(offsetX, offsetY);

   }

   const mouseUp = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if(gameClass && gameClass.loaded) gameClass.mouseUp(offsetX, offsetY);

   }

   const mouseMove = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if(gameClass && gameClass.loaded) gameClass.mouseMove(offsetX, offsetY);

   }

   const mouseLeave = ({ nativeEvent }) => {
      nativeEvent.preventDefault();

      const { offsetX, offsetY } = nativeEvent;

      if(gameClass && gameClass.loaded) gameClass.mouseLeave(offsetX, offsetY);

   }

   const mouseEnter = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if(gameClass && gameClass.loaded) gameClass.mouseEnter(offsetX, offsetY);

   }

   const mouseWheel = ({ nativeEvent }) => {
      const { deltaY } = nativeEvent;

      if(gameClass && gameClass.loaded) gameClass.mouseWheel(deltaY);
   }

   const keyPress = (nativeEvent) => {
      nativeEvent.preventDefault();
      if(gameClass && gameClass.loaded) gameClass.keyPress(nativeEvent.key)
   }
   //END INPUTS


   return (
      <>
         {/*WIN CONDITION TEXT*/}
         {
            (winCondition != null)
            &&
            <>
               <h1>{winCondition}</h1>
            </>
         }
         {/*END WIN CONDITION TEXT*/}

         {/*LOADING TEXT*/}
         {
            (imagesLoaded == false)
            &&
            <>
               <h1>Loading Images...</h1>
            </>
         }
         {/*END LOADING TEXT*/}


         {/*CANVAS*/}
         <div className={(winCondition != null || gameClass == null || imagesLoaded == false) && 'd-none'}>
            <Row className='py-2'>
               <canvas
                  ref={canvas}
                  width={window.innerWidth / 2}
                  height={window.innerHeight / 2}
                  onMouseDown={mouseDown}
                  onMouseUp={mouseUp}
                  onMouseMove={mouseMove}
                  onMouseLeave={mouseLeave}
                  onMouseEnter={mouseEnter}
                  onWheel={mouseWheel}
                  style={
                     { imageRendering: 'crisp-edges' }
                  }
                  className="mx-auto border"
               />
            </Row>
         </div>
         {/*END CANVAS*/}


         {/*GAME CREATION FORM*/}
         <Form className='mt-5 mb-5 border w-50 mx-auto' onSubmit={startNewGame}>

            <Form.Group className='my-4 d-flex justify-content-center'>
               <Form.Label className='my-auto mx-1 w-50 text-right'>Example Size Setting</Form.Label>
               <div className='w-50 mx-1 '>
                  <Form.Control as="select" className='my-auto w-50' value={sizeSetting} onChange={(e) => setSize(e.target.value)}>
                     <option value={'small'}>Small</option>
                     <option value={'medium'}>Medium</option>
                     <option value={'large'}>Large</option>
                     <option value={'extralarge'}>Extra Large</option>
                     <option value={'massive'}>Massive</option>
                  </Form.Control>
               </div>
            </Form.Group>

            <Form.Group className='d-flex justify-content-center'>
               <Button className='m-1' type="submit">Run Game</Button>
            </Form.Group>

         </Form>
         {/*END GAME CREATION FORM*/}
      </>
   )
}

export default ContentPanel
