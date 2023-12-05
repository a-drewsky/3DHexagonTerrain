import { Card, Col } from 'react-bootstrap'

const CardObject = (props) => {

    let sizeTestCanvas = document.createElement('canvas')
    let sizeCtx = sizeTestCanvas.getContext('2d')
    let titleWidth = sizeCtx.measureText(props.card.name).width
    
    return (
        <Col className='mx-2 p-0'>
            <Card className={`pe-auto ${props.selected && 'border border-dark'} `} style={{ width: '6rem', height: '8.4rem', backgroundColor: 'rgba(250,250,250,0.95)' }} onClick={() => { props.gameClass.uiInput(`card_${props.cardNum}`) }}>
                <Card.Body className='p-0 d-flex flex-column'>
                    <Card.Title className={`d-block m-0 p-1 text-center ${props.card.flipped && 'opacity-0'} `} style={{ height: '2rem', overflow: 'hidden', lineHeight: '1rem', fontSize: 700 / titleWidth }}>{props.card.name}</Card.Title>
                    <Card.Img src={props.card.image} className={`d-block m-0 mx-auto p-1 ${props.card.flipped && 'opacity-0'} `} style={{ height: '5rem', width: 'auto' }} />
                    <Card.Title className={`text-end d-block small p-1 m-0 mt-auto ${props.card.flipped && 'opacity-0'} `} style={{ height: '1.4rem', fontSize: '0.9rem' }}>
                        {props.card.cost.map((cost, index) =>
                                    <span
                                        className={` 
                                        ${(index === 0 && props.card.cost.length > 1) && 'me-1'}
                                        ${(index === props.card.cost.length - 1 && props.card.cost.length > 2) && 'ms-1'}
                                        `}
                                        key={index}>
                                        {cost.amount}<img src={props.resourceIcons[cost.resource]} className='mb-1' style={{height: '0.7rem'}}/>
                                    </span>
                                )}
                    </Card.Title>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default CardObject