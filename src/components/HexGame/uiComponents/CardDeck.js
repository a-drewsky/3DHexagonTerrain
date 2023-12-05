import CardObject from "./Card"
import LargeCardObject from "./LargeCard"

import { Row } from 'react-bootstrap'

import goldIcon from '../images/ui/resourceIcons/gold_icon.png'
import copperIcon from '../images/ui/resourceIcons/copper_icon.png'
import ironIcon from '../images/ui/resourceIcons/iron_icon.png'
import rubyIcon from '../images/ui/resourceIcons/ruby_icon.png'
import amethystIcon from '../images/ui/resourceIcons/amethyst_icon.png'
import jade_icon from '../images/ui/resourceIcons/jade_icon.png'
import lapis_icon from '../images/ui/resourceIcons/lapis_icon.png'

const resourceIcons = {
    gold: goldIcon,
    copper: copperIcon,
    iron: ironIcon,
    ruby: rubyIcon,
    amethyst: amethystIcon,
    jade: jade_icon,
    lapis: lapis_icon
}

const CardDeck = (props) => {

    return (
        <div className='position-absolute bottom-0 start-0 p-0 m-0'>
            <Row className='m-0 p-0 ms-3 mb-3' >
                {props.selectedCard !== null && <LargeCardObject card={props.cards[props.selectedCard]} resourceIcons={resourceIcons} gameClass={props.gameClass} buttons={true} />}
                {props.selectedSprite !== null && <LargeCardObject card={props.selectedSprite} resourceIcons={resourceIcons} gameClass={props.gameClass} buttons={false} />}
            </Row>
            <Row className='m-0 p-0 ms-3 mb-3' >
                {props.cards.map((card, index) => <CardObject key={index} cardNum={index} card={card} selected={props.selectedCard !== null && props.selectedCard===index} resourceIcons={resourceIcons} gameClass={props.gameClass} />)}
            </Row>
        </div>
    )
}

export default CardDeck