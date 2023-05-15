
import ResourceBar from '../uiComponents/ResourceBar';
import ContextMenu from '../uiComponents/ContextMenu';
import ControlButtons from '../uiComponents/ControlButtons'
import PauseMenu from '../uiComponents/PauseMenu';
import EndGameMenu from '../uiComponents/EndGameMenu';

import { Container } from 'react-bootstrap';

const UiOverlay = (props) => {

    return (
        <Container className='p-0'>
            <ResourceBar resources={props.uiComponents.resources}></ResourceBar>
            <ControlButtons gameClass={props.gameClass}></ControlButtons>
            {
                (props.uiComponents.contextMenu.show == true) &&
                <ContextMenu x={props.uiComponents.contextMenu.x} y={props.uiComponents.contextMenu.y} buttonList={props.uiComponents.contextMenu.buttonList} gameClass={props.gameClass}></ContextMenu>
            }
            {
                (props.uiComponents.pauseMenu.show == true) &&
                <PauseMenu gameClass={props.gameClass} endGame={props.endGame}></PauseMenu>
            }
            {
                (props.uiComponents.endGameMenu.show == true) &&
                <EndGameMenu gameClass={props.gameClass} endGame={props.endGame} restartGame={props.restartGame}></EndGameMenu>
            }
        </Container>
    )

}

export default UiOverlay