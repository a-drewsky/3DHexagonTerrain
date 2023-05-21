import { Card, Col } from 'react-bootstrap'

import unitImage from '../exampleGameFramework/images/units/villagerUnit/villager_unit_icon.png'
import goldImage from '../exampleGameFramework/images/ui/gold_icon.png'

const CardObject = (props) => {


    return (
        <Col className='mx-2 p-0'>
            <Card className='pe-auto' style={{ width: '6rem', height: '8.4rem', backgroundColor: 'rgba(250,250,250,0.95)' }} onClick={() => {props.gameClass.uiInput(`card_${props.cardNum}`)}}>
                <Card.Body className='p-0 d-flex flex-column'>
                    <Card.Title className={`d-block m-0 p-1 text-center ${props.flipped && 'opacity-0'} `} style={{ height: '2rem' }}>Villager</Card.Title>
                    <Card.Img src={unitImage} className={`d-block m-0 mx-auto p-1 ${props.flipped && 'opacity-0'} `} style={{ height: '5rem', width: 'auto'}}/>
                    <Card.Title className={`text-end d-block small p-1 m-0 mt-auto ${props.flipped && 'opacity-0'} `} style={{ height: '1.4rem' }}> 2 <img src={goldImage} className='h-100 mb-1' /> </Card.Title>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default CardObject