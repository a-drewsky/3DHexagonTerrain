import { Button } from 'react-bootstrap'

const ControlButtons = (props) => {


    return (
        <div className='position-absolute bottom-0 end-0 m-3 p-0'>
            <div style={{ border: '2px', borderStyle: 'solid', background: 'lightsteelblue' }} className='d-inline-block mx-2'>
                <Button id='btnPause' className='m-2' onClick={() => { props.gameClass.uiInput('pause') }}>Pause</Button>
            </div>
            <div style={{ border: '2px', borderStyle: 'solid', background: 'lightsteelblue' }} className='d-inline-block mx-2'>
                <Button id='btnLeft' className='m-2' onClick={() => { props.gameClass.uiInput('rotateLeft') }}>Left</Button>
                <Button id='btnRight' className='m-2' onClick={() => { props.gameClass.uiInput('rotateRight') }}>Right</Button>
            </div>
        </div>
    )
}

export default ControlButtons