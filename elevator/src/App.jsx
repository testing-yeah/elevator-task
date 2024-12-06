import { useEffect, useRef, useState } from 'react'
import './App.css'
import Elevator from './components/elevator'

function App() {
  const [totalElevator, setTotalEvelator] = useState({})
  const [elevatorLocation, setElevatorLocation] = useState({
    1: { floor: 0, isElevatorActive: false },
    2: { floor: 0, isElevatorActive: false },
    3: { floor: 0, isElevatorActive: false },
    4: { floor: 0, isElevatorActive: false },
    5: { floor: 0, isElevatorActive: false },
  })

  useEffect(() => {
    let obj = {}
    for (let i = 1; i <= 7; i++) {
      let Arr = []
      for (let j = 1; j <= 10; j++) {
        Arr.push(10 - j)
      }
      obj[i] = Arr
    }
    setTotalEvelator(obj)
  }, [])

  const findNearestElevator = (elevatorLocation, selectedFloor) => {
    let nearestElevator = null;
    let smallestDifference = Infinity;
    const ArrayOfObject = Object.entries(elevatorLocation)
    for (const [elevatorId, { floor, isElevatorActive }] of ArrayOfObject) {
      if (!isElevatorActive) {
        const difference = Math.abs(floor - selectedFloor);
        if (difference < smallestDifference) {
          smallestDifference = difference;
          nearestElevator = { elevatorId, floor: selectedFloor, isElevatorActive: true };
        }
      }
    }

    return nearestElevator;
  };

  const refSetTimeout = useRef()
  const refSetInterval = useRef()

  function handleSelectFloor(selectedFloor) {
    const nearestElevator = findNearestElevator(elevatorLocation, selectedFloor);
    const { elevatorId, floor, isElevatorActive } = nearestElevator
    refSetTimeout[elevatorId] = setTimeout(() => handleRemoveActive(elevatorId), 1000)
    refSetInterval[elevatorId] = setInterval(() => handleInterval(elevatorId, selectedFloor), 500)
  }

  function handleInterval(id, selectedFloorForCount) {
    delete refSetInterval[id]
    clearInterval(refSetInterval[id])
    setElevatorLocation(prev => ({ ...prev, [id]: { floor: prev[id].floor < selectedFloorForCount ? prev[id].floor += 1 : selectedFloorForCount, isElevatorActive: true } }))
  }

  function handleRemoveActive(id) {
    delete refSetTimeout[id]
    clearTimeout(refSetTimeout[id])
    setElevatorLocation(prev => ({ ...prev, [id]: { ...prev[id], isElevatorActive: false } }))
  }

  return (
    <>
      <div className='flex justify-center items-center mt-5'>
        {
          totalElevator && Object.keys(totalElevator).map((ele) => {
            return (
              <div className='flex flex-col'>
                {
                  totalElevator[ele].map((floor) => {
                    return <Elevator floor={floor} ele={ele} elevatorLocation={elevatorLocation} handleSelectFloor={handleSelectFloor} />
                  })
                }
              </div>
            )
          })
        }
      </div >
    </>
  )
}

export default App
