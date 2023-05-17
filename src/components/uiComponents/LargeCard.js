import { Card, Col, Row, Button, ButtonGroup } from 'react-bootstrap'

import unitImage from '../exampleGameFramework/images/units/villagerUnit/villager_unit_icon.png'
import goldImage from '../exampleGameFramework/images/ui/gold_icon.png'

const LargeCardObject = (props) => {


    return (
        <Col className='mx-2 p-0'>
            <Card style={{ width: '12rem', backgroundColor: 'rgba(250,250,250,0.95)' }} onClick={() => { props.gameClass.uiInput(`card_${props.cardNum}`) }}>
                <Card.Body className='p-1'>
                    <Card.Title className={props.flipped && 'opacity-0'}>Villager</Card.Title>
                    <Card.Img variant="top" src={unitImage} className={`w-50 d-block mx-auto my-1 ${props.flipped && 'opacity-0'} `} />
                    <Card.Title className={`text-end mb-0 ${props.flipped && 'opacity-0'} `}> 2 <img src={goldImage} style={{ height: '1.2rem' }} /> </Card.Title>
                    <ButtonGroup className={`${props.flipped && 'opacity-0'} w-100 my-2`}>
                        <Button variant='success' onClick={() => { props.gameClass.uiInput(`use_card`) }}>Use</Button> <Button variant='warning' onClick={() => { props.gameClass.uiInput(`scrap_card`) }}>Scrap</Button>
                    </ButtonGroup>

                </Card.Body>
            </Card>
        </Col>
    )
}

export default LargeCardObject