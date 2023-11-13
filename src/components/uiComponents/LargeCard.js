import { Card, Col, Row, Button, ButtonGroup } from 'react-bootstrap'

const LargeCardObject = (props) => {

    return (
        <Col className='ms-2 p-0'>
            <Card className='pe-auto' style={{ width: '12rem', height: '16.8rem', backgroundColor: 'rgba(250,250,250,0.95)' }} onClick={() => { props.gameClass.uiInput(`card_${props.cardNum}`) }}>
                <Card.Body className='p-0'>
                    <Card.Title className={`d-block m-0 p-1 text-center`} style={{ height: '2rem' }}>{props.card.name}</Card.Title>
                    <Row style={{ height: '5rem' }} className='m-0 p-0'>
                        <Col className='col-6 px-0'>
                            <Card.Img src={props.card.image || props.card.imageObject.icon} className={`d-block m-0 mx-auto p-1`} style={{ height: '5rem', width: 'auto' }} />
                        </Col>
                        <Col className='col-6 px-0 text-center my-auto'>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small'>HP {props.card.stats.health}</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small'>MV {props.card.stats.movement}</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small '>MN {props.card.stats.mining}</Card.Text>
                        </Col>
                    </Row>
                    <Row style={{ height: '4rem' }} className=' m-0 p-0'>
                        <Col className='col-6 px-0 text-center my-auto'>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>PA {props.card.stats.physical_attack}</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                {props.card.stats.physical_attack_modifications.map((mod, index) =>
                                    <span
                                        className={`rounded px-1 
                                        ${(index === 0 && props.card.stats.physical_attack_modifications.length > 1) && 'me-1'}
                                        ${(index === props.card.stats.physical_attack_modifications.length - 1 && props.card.stats.physical_attack_modifications.length > 2) && 'ms-1'}
                                        `}
                                        key={index}
                                        style={{ backgroundColor: mod.color }}>
                                        {mod.name}
                                    </span>
                                )}
                            </Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>EA {props.card.stats.elemental_attack}</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                {props.card.stats.elemental_attack_modifications.map((mod, index) =>
                                    <span
                                        className={`rounded px-1 
                                    ${(index === 0 && props.card.stats.elemental_attack_modifications.length > 1) && 'me-1'}
                                    ${(index === props.card.stats.elemental_attack_modifications.length - 1 && props.card.stats.elemental_attack_modifications.length > 2) && 'ms-1'}
                                    `}
                                        key={index}
                                        style={{ backgroundColor: mod.color }}>
                                        {mod.name}
                                    </span>
                                )}
                            </Card.Text>
                        </Col>
                        <Col className='col-6 px-0 text-center my-auto'>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>PR {props.card.stats.physical_resistance}</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                {props.card.stats.physical_resistance_modifications.map((mod, index) =>
                                    <span
                                        className={`rounded px-1 
                                    ${(index === 0 && props.card.stats.physical_resistance_modifications.length > 1) && 'me-1'}
                                    ${(index === props.card.stats.physical_resistance_modifications.length - 1 && props.card.stats.physical_resistance_modifications.length > 2) && 'ms-1'}
                                    `}
                                        key={index}
                                        style={{ backgroundColor: mod.color }}>
                                        {mod.name}
                                    </span>
                                )}
                            </Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small' style={{ height: '1rem' }}>ER {props.card.stats.elemental_resistance}</Card.Text>
                            <Card.Text className='w-100 m-0 p-0 font-monospace small fw-bold' style={{ fontSize: '0.5rem' }}>
                                {props.card.stats.elemental_resistance_modifications.map((mod, index) =>
                                    <span
                                        className={`rounded px-1 
                                    ${(index === 0 && props.card.stats.elemental_resistance_modifications.length > 1) && 'me-1'}
                                    ${(index === props.card.stats.elemental_resistance_modifications.length - 1 && props.card.stats.elemental_resistance_modifications.length > 2) && 'ms-1'}
                                    `}
                                        key={index}
                                        style={{ backgroundColor: mod.color }}>
                                        {mod.name}
                                    </span>
                                )}
                            </Card.Text>
                        </Col>
                    </Row>
                    <Card.Text className='small text-justify p-1 m-0 overflow-auto' style={{ height: '4.4rem', lineHeight: '0.9rem' }}>
                        {props.card.description}
                    </Card.Text>
                    <Card.Title className={`text-end d-block m-0 font-bold ${props.card.flipped && 'opacity-0'} `} style={{ height: '1.4rem', fontSize: '1rem' }}>
                        {props.card.cost && props.card.cost.map((cost, index) =>
                            <span
                                className={`mx-1`}
                                key={index}>
                                {cost.amount}<img src={props.resourceIcons[cost.resource]} className='mb-1' style={{ height: '0.8rem' }} />
                            </span>
                        )}
                    </Card.Title>
                </Card.Body>
            </Card>
            {
                props.buttons &&
                <ButtonGroup className={`pe-auto w-100 my-1`} style={{ maxWidth: '12rem', border: 'solid 2px white', opacity: '0.95' }}>
                    <Button variant='success' onClick={() => { props.gameClass.uiInput(`use_card`) }} >Use</Button> <Button variant='warning' onClick={() => { props.gameClass.uiInput(`scrap_card`) }}>Scrap</Button>
                </ButtonGroup>
            }
        </Col>
    )
}

export default LargeCardObject