import React, { useState, useRef, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'

import GameMainClass from '../exampleGameFramework/GameMainClass';

import GameImagesClass from '../exampleGameFramework/imageLoaders/gameImages';

import UiOverlay from './UiOverlay';

const ContentPanel = () => {

   //SETUP
   const canvas = useRef(null);
   const bgCanvas = useRef(null);

   const [gameClass, setGameClass] = useState(null);

   const [gameImages, setGameImages] = useState(new GameImagesClass());

   const [imagesLoaded, setImagesLoaded] = useState(false);

   const [uiComponents, setUiComponents] = useState({
      pauseMenu: {
         show: false
      },
      endGameMenu: {
         show: false
      },
      bgCanvas: {
         x: 0,
         y: 0,
         width: 0,
         height: 0
      },
      contextMenu: {
         show: false,
         x: 0,
         y: 0,
         buttonList: []
      },
      resources: {
         gold: 0,
         copper: 0,
         iron: 0,
         ruby: 0,
         amethyst: 0
      },
      cards: [],
      selectedCard: null,
      selectedSprite: null
   })

   const [initialUi, setInitialUi] = useState({...uiComponents})
   //END SETUP


   //SETTINGS
   const [sizeSetting, setSize] = useState('small');
   //END SETTINGS

   const updateUi = (newUi) => {
      setUiComponents(({ pauseMenu, endGameMenu, bgCanvas, contextMenu, resources, cards, selectedCard, selectedSprite }) => ({ 
         pauseMenu: newUi.pauseMenu, 
         endGameMenu: newUi.endGameMenu,
         bgCanvas: newUi.bgCanvas,
         contextMenu: newUi.contextMenu, 
         resources: newUi.resources,
         cards: newUi.cards,
         selectedCard: newUi.selectedCard,
         selectedSprite: newUi.selectedSprite
      }));
   }


   //CREATE NEW GAME METHOD
   const startNewGame = (e) => {
      if(e) e.preventDefault();

      gameClass.clear();
      setUiComponents(initialUi)
      gameClass.startGame({ mapSize: sizeSetting });
   }

   const endGame = () => {
      if (gameClass) gameClass.clear();
      setUiComponents(initialUi)
   }

   const restartGame = () => {
      endGame()
      startNewGame()
   }
   //END CREATE NEW GAME METHOD

   useEffect(() => {
      gameImages.loadImages(setImagesLoaded);
      setGameClass(new GameMainClass(canvas.current,bgCanvas.current,gameImages,uiComponents,updateUi))
   }, [gameImages])

   useEffect(() => {
      document.addEventListener('keydown', e => keyDown(e))
      document.addEventListener('keyup', e => keyUp(e))
   }, [gameClass])


   //INPUTS
   const mouseDown = ({ nativeEvent }) => {
      nativeEvent.preventDefault();
      nativeEvent.stopPropagation();
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
         <div className={(gameClass == null || gameClass.loaded == false || imagesLoaded == false) && 'd-none'}>
            <Row className='py-2'>
               <div style={{ width: Math.min(window.innerWidth, 1000), height: window.innerHeight / 2, position: 'relative', overflow: 'hidden' }} className='border mx-auto p-0'>
               <canvas
                     ref={bgCanvas}
                     width={0}
                     height={0}
                     style={
                        { imageRendering: 'pixelated', touchAction: 'none', width: uiComponents.bgCanvas.width, height: uiComponents.bgCanvas.height, left: uiComponents.bgCanvas.x, top: uiComponents.bgCanvas.y, position: 'absolute' }
                     }
                  />
                  <canvas
                     ref={canvas}
                     width={Math.min(window.innerWidth, 1000)}
                     height={window.innerHeight / 2}
                     onPointerDown={mouseDown}
                     onPointerUp={mouseUp}
                     onPointerMove={mouseMove}
                     onPointerLeave={mouseUp}

                     onWheel={mouseWheel}
                     style={
                        { imageRendering: 'pixelated', touchAction: 'none', width: Math.min(window.innerWidth, 1000), height: window.innerHeight / 2, position: 'absolute' }
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
                           <option value={'square'}>Square</option>
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
