
import ResourceBar from '../uiComponents/ResourceBar';
import ContextMenu from '../uiComponents/ContextMenu';
import RotationButtons from '../uiComponents/RotationButtons'

const UiOverlay = (props) => {

    return (
        <>
            <ResourceBar resourceNum={props.uiComponents.resourceBar.resourceNum}></ResourceBar>
            <RotationButtons gameClass={props.gameClass}></RotationButtons>
            {
                (props.uiComponents.contextMenu.show == true) &&
                <ContextMenu x={props.uiComponents.contextMenu.x} y={props.uiComponents.contextMenu.y} buttonList={props.uiComponents.contextMenu.buttonList} gameClass={props.gameClass}></ContextMenu>
            }
        </>
    )

}

export default UiOverlay