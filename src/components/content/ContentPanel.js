import React, { useState, useRef, useEffect } from 'react'
import { Row, Form, Button } from 'react-bootstrap'

import GameMainClass from '../exampleGameFramework/GameMainClass';

const ContentPanel = () => {

   //SETUP
   const canvas = useRef(null);

   const [gameClass, setGameClass] = useState(null);

   const [winCondition, setWinCondition] = useState(null);
   //END SETUP


   //SETTINGS
   const [sizeSetting, setSize] = useState(50);
   //END SETTINGS


   //CREATE NEW GAME METHOD
   const startNewGame = (e) => {
      e.preventDefault();

      if (gameClass) gameClass.clear();
      let newGameClass = new GameMainClass(
         canvas.current,
         setWinCondition,
         {
            size: sizeSetting
         }
      );

      newGameClass.createGame();
      setGameClass(newGameClass);

      setWinCondition(null);
   }
   //END CREATE NEW GAME METHOD


   //INPUTS
   const mouseDown = ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;

      gameClass.click(offsetX, offsetY);

   }
   //END INPUJTS


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


         {/*CANVAS*/}
         <div className={(winCondition != null || gameClass == null) && 'd-none'}>
            <Row className='py-2'>
               <canvas
                  ref={canvas}
                  width={window.innerWidth / 3}
                  height={window.innerWidth / 3}
                  onMouseDown={mouseDown}
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
                     <option value={30}>Small</option>
                     <option value={40}>Medium</option>
                     <option value={50}>Large</option>
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
