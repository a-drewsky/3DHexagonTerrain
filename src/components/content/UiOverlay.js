
import ResourceBar from '../uiComponents/ResourceBar';
import ControlButtons from '../uiComponents/ControlButtons'
import PauseMenu from '../uiComponents/PauseMenu';
import EndGameMenu from '../uiComponents/EndGameMenu';
import CardDeck from '../uiComponents/CardDeck';

import { Container } from 'react-bootstrap';

const UiOverlay = (props) => {

    return (
        <Container className='p-0 w-100 h-100 user-select-none pe-none'>
            <ResourceBar resources={props.uiComponents.resources}></ResourceBar>
            <ControlButtons gameClass={props.gameClass}></ControlButtons>
            <CardDeck gameClass={props.gameClass} cards={props.uiComponents.cards} selectedCard={props.uiComponents.selectedCard} selectedSprite={props.uiComponents.selectedSprite}></CardDeck>
            {
                (props.uiComponents.pauseMenu.show === true) &&
                <PauseMenu gameClass={props.gameClass} endGame={props.endGame}></PauseMenu>
            }
            {
                (props.uiComponents.endGameMenu.show === true) &&
                <EndGameMenu gameClass={props.gameClass} endGame={props.endGame} restartGame={props.restartGame}></EndGameMenu>
            }
        </Container>
    )

}

export default UiOverlay