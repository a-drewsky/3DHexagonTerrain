import { Button } from 'react-bootstrap'

const RotationButtons = (props) => {


    return (
        <div style={{ border: '2px', borderStyle: 'solid', background: 'lightsteelblue' }} className='position-absolute bottom-0 end-0 m-3 p-2'>
            <Button id='btnLeft' className='m-2' onClick={() => { props.gameClass.uiInput('rotateLeft') }}>Left</Button>
            <Button id='btnRight' className='m-2' onClick={() => { props.gameClass.uiInput('rotateRight') }}>Right</Button>
        </div>
    )
}

export default RotationButtons