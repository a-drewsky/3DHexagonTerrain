import CardObject from "./Card"
import LargeCardObject from "./LargeCard";

import { Row } from 'react-bootstrap';

const CardDeck = (props) => {

    return (
        <div className='position-absolute bottom-0 start-0 p-0 m-0'>
            <Row className='m-0 p-0 ms-3 mb-3' >
                {props.selectedCard !== null && <LargeCardObject gameClass={props.gameClass} />}
            </Row>
            <Row className='m-0 p-0 ms-3 mb-3' >
                {props.cards.map((card, index) => <CardObject key={index} cardNum={index} flipped={card.flipped ? true : false} gameClass={props.gameClass} />)}
            </Row>
        </div>
    )
}

export default CardDeck