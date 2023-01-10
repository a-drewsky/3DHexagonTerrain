
import { Button } from 'react-bootstrap'

const ContextMenu = (props) => {

    return (
        <div style={{ border: '2px', borderStyle: 'solid', width: '100px', height: '150px', background: 'darkorange', position: 'absolute', top: props.y, left: props.x }} >

            <Button className='d-block mx-auto my-2' onClick={() => {props.gameClass.uiInput('move')}}>Move</Button>
            <Button className='d-block mx-auto my-2' onClick={() => {props.gameClass.uiInput('cancel')}}>Cancel</Button>

        </div>
    )


}

export default ContextMenu