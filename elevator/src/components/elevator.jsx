import React, { useEffect } from 'react'
import ElevatorSvg from '../assets/elevator'

function Elevator({ floor, ele, elevatorLocation, handleSelectFloor }) {
    if (ele == 1) {
        return (
            <div className='w-24 h-20 flex justify-center items-center'>
                {floor == 0 ? 'Ground Floor' : `Floor ${floor}`}
            </div>
        )
    }

    if (ele > 1 && ele < 7) {
        return <>
            <div className='w-24 h-20 border border-gray-400 flex justify-center items-center'>
                {elevatorLocation[ele - 1].floor == floor && < div className='w-12'>
                    {ElevatorSvg()}
                </div>}
            </div>
        </>
    }

    if (ele == 7) {
        return (
            <button className='w-24 h-20 flex justify-center items-center bg-green-500 ml-3' onClick={() => handleSelectFloor(floor)}>
                Call
            </button>
        )
    }
}

export default Elevator