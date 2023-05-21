import { Card, Col, Row, Button, ButtonGroup } from 'react-bootstrap'

import unitImage from '../exampleGameFramework/images/units/villagerUnit/villager_unit_icon.png'
import goldImage from '../exampleGameFramework/images/ui/gold_icon.png'

const LargeCardObject = (props) => {


    return (
        <Col className='ms-2 p-0'>
            <Card className='pe-auto' style={{ width: '12rem', height: '16.8rem', backgroundColor: 'rgba(250,250,250,0.95)' }} onClick={() => { props.gameClass.uiInput(`card_${props.cardNum}`) }}>
                <Card.Body className='p-0'>
                    <Card.Title className={`d-block m-0 p-1 text-center`} style={{ height: '2rem' }}>Villager</Card.Title>
                    <Row style={{ height: '5rem' }} className='m-0 p-0'>
                        <Col className='col-6 px-0'>
                            <Card.Img src={unitImage} className={`d-block m-0 mx-auto p-1`} style={{ height: '5rem', width: 'auto' }} />
                        </Col>
                        <Col className='col-6 px-0 text-center my-auto'>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small'>HP 10</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small '>MN 01</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small'>MV 04</Card.Text>
                        </Col>
                    </Row>
                    <Row style={{ height: '4rem' }} className=' m-0 p-0'>
                        <Col className='col-6 px-0 text-center my-auto'>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>PA 01 </Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                <span className='rounded px-1' style={{ backgroundColor: 'orange' }}>sav-</span>
                                <span className='rounded px-1 ms-1' style={{ backgroundColor: 'lightblue' }}>tdr-</span>
                            </Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>EA 01</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                <span className='rounded px-1 me-1' style={{ backgroundColor: 'lightgreen' }}>grs+</span>
                                <span className='rounded px-1' style={{ backgroundColor: 'orange' }}>sav-</span>
                                <span className='rounded px-1 ms-1' style={{ backgroundColor: 'lightblue' }}>tdr-</span>
                            </Card.Text>
                        </Col>
                        <Col className='col-6 px-0 text-center my-auto'>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>PR 01 </Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                <span className='rounded px-1 me-1' style={{ backgroundColor: 'lightgreen' }}>grs+</span>
                            </Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>ER 01</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                <span className='rounded px-1 me-1' style={{ backgroundColor: 'lightgreen' }}>grs+</span>
                                <span className='rounded px-1' style={{ backgroundColor: 'orange' }}>sav-</span>
                                <span className='rounded px-1 ms-1' style={{ backgroundColor: 'lightblue' }}>tdr-</span>
                            </Card.Text>
                        </Col>
                    </Row>
                    <Card.Text className='small text-justify p-1 m-0 overflow-auto' style={{ height: '4.4rem', lineHeight: '0.9rem' }}>
                        An average villager meant for testing purposes. Has no unique abilities.
                    </Card.Text>
                    <Card.Title className={`text-end d-block small p-1 m-0`} style={{ height: '1.4rem' }}> 2 <img src={goldImage} className='h-100 mb-1' /> </Card.Title>
                </Card.Body>
            </Card>
            <ButtonGroup className={`pe-auto ${props.flipped && 'opacity-0'} w-100 my-1`} style={{ maxWidth: '12rem', border: 'solid 2px white', opacity: '0.95' }}>
                <Button variant='success' onClick={() => { props.gameClass.uiInput(`use_card`) }} >Use</Button> <Button variant='warning' onClick={() => { props.gameClass.uiInput(`scrap_card`) }}>Scrap</Button>
            </ButtonGroup>
        </Col>
    )
}

export default LargeCardObject