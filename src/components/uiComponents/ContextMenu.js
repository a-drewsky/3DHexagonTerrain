
import { Button } from 'react-bootstrap'

const ContextMenu = (props) => {

    return (
        <div style={{ border: '2px', borderStyle: 'solid', background: 'darkorange', position: 'absolute', bottom: window.innerHeight / 2 - props.y, left: props.x }} className='p-2'>

            {props.buttonList.includes('btnMove') && <Button id='btnMove' className='d-block mx-auto my-2' onClick={() => {props.gameClass.uiInput('move')}}>Move</Button>}
            {props.buttonList.includes('btnMine') && <Button id='btnMine' className='d-block mx-auto my-2' onClick={() => {props.gameClass.uiInput('mine')}}>Mine</Button>}
            {props.buttonList.includes('btnAttack') && <Button id='btnAttack' className='d-block mx-auto my-2' onClick={() => {props.gameClass.uiInput('attack')}}>Attack</Button>}
            {props.buttonList.includes('btnCancel') && <Button id='btnCancel' className='d-block mx-auto my-2' onClick={() => {props.gameClass.uiInput('cancel')}}>Cancel</Button>}

        </div>
    )


}

export default ContextMenu