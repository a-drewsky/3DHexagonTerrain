
import ResourceBar from './ResourceBar';
import ControlButtons from './ControlButtons'
import PauseMenu from './PauseMenu';
import EndGameMenu from './EndGameMenu';
import CardDeck from './CardDeck';

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