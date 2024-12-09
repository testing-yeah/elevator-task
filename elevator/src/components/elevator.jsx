import React from 'react'
import { ElevatorSvg } from '../assets/elevator'

function Elevator({ floor, ele, elevatorLocation, handleSelectFloor, arrayOfSelectedFloor }) {
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
                {/* {ele == 2 && arrayOfSelectedFloor[floor] == floor && `${floor * 500}Sec`} */}
                {elevatorLocation[ele - 1].floor == floor && < div className='w-12'>
                    {ElevatorSvg()}
                </div>}
            </div>
        </>
    }

    if (ele == 7) {
        return (
            <button disabled={arrayOfSelectedFloor[floor] !== undefined && true} className={`w-24 h-20 flex justify-center items-center ${arrayOfSelectedFloor[floor] == 'pending' ? 'bg-red-600' : arrayOfSelectedFloor[floor] == 'arrived' ? 'bg-transparent border' : 'bg-green-500'} ml-3`} onClick={() => handleSelectFloor(floor)}>
                {arrayOfSelectedFloor[floor] == 'pending' ? 'Waiting' : arrayOfSelectedFloor[floor] == 'arrived' ? 'Arrived' : "Call"}
            </button>
        )
    }
}

export default Elevator