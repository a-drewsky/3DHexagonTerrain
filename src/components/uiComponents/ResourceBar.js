

const ResourceBar = (props) => {

    return (
        <div style={{ border: '2px', borderStyle: 'solid', background: 'lightsteelblue', position: 'absolute', bottom: window.innerHeight / 2 - props.y, left: props.x }} className='p-2 m-4'>

            <h4>Resources: {props.resourceNum}</h4>

        </div>
    )


}

export default ResourceBar