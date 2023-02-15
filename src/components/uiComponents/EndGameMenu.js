import { Button, Row, Col } from 'react-bootstrap'

const EndGameMenu = (props) => {


    return (
        <>
            <div className='position-absolute w-100 h-100 bg-info opacity-25'>
            </div>
            <div className='position-absolute w-100 h-100'>
                <Row className='h-100 d-flex align-items-center'>
                    <Col xs={3} className='mx-auto'>
                        <div style={{ border: '2px', borderStyle: 'solid', background: 'lightsteelblue' }} className='py-3'>
                            <Button id='btnRestart' className='my-3 w-75 mx-auto d-block' onClick={() => { props.restartGame() }}>Restart</Button>
                            
                            <Button id='btnExit' className='my-3 w-75 mx-auto d-block' onClick={() => { props.endGame() }}>Exit</Button>
                        </div>
                    </Col>
                </Row>
            </div>

        </>
    )
}

export default EndGameMenu