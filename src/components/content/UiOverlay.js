

import ContextMenu from './ContextMenu';

const UiOverlay = (props) => {

    return (
        <>
            {
                (props.uiComponents.contextMenu.show == true) &&
                <ContextMenu x={props.uiComponents.contextMenu.x} y={props.uiComponents.contextMenu.y}></ContextMenu>
            }
        </>
    )

}

export default UiOverlay