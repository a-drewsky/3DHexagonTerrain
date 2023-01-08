

const ContextMenu = (props) => {

    return (
        <div style={{border: '2px', borderStyle: 'solid', width: '100px', height: '150px', background: 'darkorange', position: 'absolute', top: props.y, left: props.x}} >

            <h5 style={{color: 'white'}} className='text-center'>Test Context Menu</h5>
        </div>
    )


}

export default ContextMenu