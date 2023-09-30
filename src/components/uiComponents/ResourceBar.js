import amethyst_icon from '../HexGame/images/ui/amethyst_icon.png';
import copper_icon from '../HexGame/images/ui/copper_icon.png';
import gold_icon from '../HexGame/images/ui/gold_icon.png';
import iron_icon from '../HexGame/images/ui/iron_icon.png';
import ruby_icon from '../HexGame/images/ui/ruby_icon.png';

import { Row, Col } from 'react-bootstrap'

const ResourceBar = (props) => {

    return (

            <Row style={{ border: '2px', borderStyle: 'solid', background: 'rgba(200,220,250,0.75)', position: 'absolute', bottom: window.innerHeight / 2 - props.y, left: props.x }} className='p-2 m-4 align-items-center align-text-center'>
                <Col className='pe-1'> <h4 className='my-auto'> {props.resources.gold} </h4> </Col> <Col className='ps-1'> <img height={25} className='my-auto' src={gold_icon} /> </Col>
                <Col className='pe-1'> <h4 className='my-auto'> {props.resources.copper} </h4> </Col> <Col className='ps-1'> <img height={25} className='my-auto' src={copper_icon} /> </Col>
                <Col className='pe-1'> <h4 className='my-auto'> {props.resources.iron} </h4> </Col> <Col className='ps-1'> <img height={25} className='my-auto' src={iron_icon} /> </Col>
                <Col className='pe-1'> <h4 className='my-auto'> {props.resources.ruby} </h4> </Col> <Col className='ps-1'> <img height={25} className='my-auto' src={ruby_icon} /> </Col>
                <Col className='pe-1'> <h4 className='my-auto'> {props.resources.amethyst} </h4> </Col> <Col className='ps-1'> <img height={25} className='my-auto' src={amethyst_icon} /> </Col>
            </Row>

    )


}

export default ResourceBar