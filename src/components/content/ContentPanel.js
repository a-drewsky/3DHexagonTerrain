import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'

import GameMainClass from '../exampleGameFramework/GameMainClass';

import GameImagesClass from '../exampleGameFramework/imageLoaders/gameImages';

import UiOverlay from './UiOverlay';

const ContentPanel = () => {

   //SETUP
   const canvas = useRef(null);

   const [gameClass, setGameClass] = useState(null);

   const [gameImages, setGameImages] = useState(new GameImagesClass());

   const [winCondition, setWinCondition] = useState(null);

   const [imagesLoaded, setImagesLoaded] = useState(false);

   const [uiComponents, setUiComponents] = useState({
      pauseMenu: {
         show: false
      },
      endGameMenu: {
         show: false
      },
      contextMenu: {
         show: false,
         x: 0,
         y: 0,
         buttonList: []
      },
      resourceBar: {
         resourceNum: 0
      }
   })
   //END SETUP


   //SETTINGS
   const [sizeSetting, setSize] = useState('small');
   //END SETTINGS

   const updateUi = (newUi) => {
      setUiComponents(({ pauseMenu, endGameMenu, contextMenu, resourceBar }) => ({ pauseMenu: newUi.pauseMenu, endGameMenu: newUi.endGameMenu, contextMenu: newUi.contextMenu, resourceBar: newUi.resourceBar }));
   }


   //CREATE NEW GAME METHOD
   const startNewGame = (e) => {
      if(e) e.preventDefault();
      if (gameClass && !gameClass.loaded) return;

      if (gameClass) gameClass.clear();
      setGameClass(null);
      let newGameClass = new GameMainClass(
         canvas.current,
         gameImages,
         setWinCondition,
         updateUi,
         {
            mapSize: sizeSetting
         }
      );

      setGameClass(newGameClass);
      newGameClass.createGame();

      setWinCondition(null);
   }

   const endGame = () => {
      if (gameClass) gameClass.clear();
      setGameClass(null);
      setUiComponents({
         pauseMenu: {
            show: false
         },
         endGameMenu: {
            show: false
         },
         contextMenu: {
            show: false,
            x: 0,
            y: 0,
            buttonList: []
         },
         resourceBar: {
            resourceNum: 0
         }
      })
   }

   const restartGame = () => {
      endGame()
      startNewGame()
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
      document.addEventListener('keydown', e => keyDown(e))
      document.addEventListener('keyup', e => keyUp(e))
   }, [gameClass])


   //INPUTS
   const mouseDown = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if (gameClass && gameClass.loaded) gameClass.mouseDown(offsetX, offsetY);

   }

   const mouseUp = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if (gameClass && gameClass.loaded) gameClass.mouseUp(offsetX, offsetY);

   }

   const mouseMove = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      const { offsetX, offsetY } = nativeEvent;

      if (gameClass && gameClass.loaded) gameClass.mouseMove(offsetX, offsetY);

   }

   const mouseWheel = ({ nativeEvent }) => {
      const { deltaY } = nativeEvent;

      if (gameClass && gameClass.loaded) gameClass.mouseWheel(deltaY);
   }

   const keyDown = (nativeEvent) => {
      nativeEvent.preventDefault();
      if (nativeEvent.repeat) return;
      if (gameClass && gameClass.loaded) gameClass.keyDown(nativeEvent.key)
   }

   const keyUp = (nativeEvent) => {
      nativeEvent.preventDefault();
      if (gameClass && gameClass.loaded) gameClass.keyUp(nativeEvent.key)
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
               <div style={{ width: Math.min(window.innerWidth, 1000), height: window.innerHeight / 2, position: 'relative', overflow: 'hidden' }} className='border mx-auto p-0'>
                  <canvas
                     ref={canvas}
                     width={Math.min(window.innerWidth, 1000)}
                     height={window.innerHeight / 2}
                     onPointerDown={mouseDown}
                     onPointerUp={mouseUp}
                     onPointerMove={mouseMove}

                     onWheel={mouseWheel}
                     style={
                        { imageRendering: 'crisp-edges', touchAction: 'none', width: '100%', height: '100%', position: 'absolute' }
                     }
                  />

                  {
                     (gameClass) &&
                     <UiOverlay uiComponents={uiComponents} gameClass={gameClass} endGame={endGame} restartGame={restartGame}></UiOverlay>
                  }

               </div>

            </Row>
         </div>
         {/*END CANVAS*/}

         <Row>
            <Col xs={3}></Col>
            <Col xs={6}>
               {/*GAME CREATION FORM*/}
               <Form className='mt-5 mb-5 border w-75 p-3 mx-auto' onSubmit={startNewGame}>

                  <Form.Group className='my-1 d-flex justify-content-center'>
                     <Form.Label className='my-auto mx-1 w-50 text-end'>Size</Form.Label>
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

            </Col>
            <Col xs={3}>
               {/*DEBUG MENU FORM*/}
               <Form className='mt-5 mb-5 border w-100 p-3 mx-auto' onSubmit={startNewGame}>

                  <Form.Group className='d-flex justify-content-center'>
                     <Button className='m-1' onClick={() => { gameClass.uiInput('switchView') }}>Switch view</Button>
                  </Form.Group>

               </Form>
               {/*END DEBUG MENU FORM*/}
            </Col>
         </Row>
      </>
   )
}

export default ContentPanel
