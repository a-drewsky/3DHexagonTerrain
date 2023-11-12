import CardObject from "./Card"
import LargeCardObject from "./LargeCard"

import { Row } from 'react-bootstrap'

import goldIcon from '../HexGame/images/ui/gold_icon.png'
import copperIcon from '../HexGame/images/ui/copper_icon.png'
import ironIcon from '../HexGame/images/ui/iron_icon.png'
import rubyIcon from '../HexGame/images/ui/ruby_icon.png'
import amethystIcon from '../HexGame/images/ui/amethyst_icon.png'

const resourceIcons = {
    gold: goldIcon,
    copper: copperIcon,
    iron: ironIcon,
    ruby: rubyIcon,
    amethyst: amethystIcon
}

const CardDeck = (props) => {

    return (
        <div className='position-absolute bottom-0 start-0 p-0 m-0'>
            <Row className='m-0 p-0 ms-3 mb-3' >
                {props.selectedCard !== null && <LargeCardObject card={props.cards[props.selectedCard]} resourceIcons={resourceIcons} gameClass={props.gameClass} buttons={true} />}
                {props.selectedSprite !== null && <LargeCardObject card={props.selectedSprite} resourceIcons={resourceIcons} gameClass={props.gameClass} buttons={false} />}
            </Row>
            <Row className='m-0 p-0 ms-3 mb-3' >
                {props.cards.map((card, index) => <CardObject key={index} cardNum={index} card={card} resourceIcons={resourceIcons} gameClass={props.gameClass} />)}
            </Row>
        </div>
    )
}

export default CardDeck