
import ResourceBar from '../uiComponents/ResourceBar';
import ContextMenu from '../uiComponents/ContextMenu';
import ControlButtons from '../uiComponents/ControlButtons'
import PauseMenu from '../uiComponents/PauseMenu';

const UiOverlay = (props) => {

    return (
        <>
            <ResourceBar resourceNum={props.uiComponents.resourceBar.resourceNum}></ResourceBar>
            <ControlButtons gameClass={props.gameClass}></ControlButtons>
            {
                (props.uiComponents.contextMenu.show == true) &&
                <ContextMenu x={props.uiComponents.contextMenu.x} y={props.uiComponents.contextMenu.y} buttonList={props.uiComponents.contextMenu.buttonList} gameClass={props.gameClass}></ContextMenu>
            }
            {
                (props.uiComponents.pauseMenu.show == true) &&
                <PauseMenu gameClass={props.gameClass} endGame={props.endGame}></PauseMenu>
            }
        </>
    )

}

export default UiOverlay