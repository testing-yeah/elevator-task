import { useEffect, useRef, useState } from 'react'
import './App.css'
import Elevator from './components/elevator'

function App() {
  const [totalElevator, setTotalEvelator] = useState({})
  const [arrayOfSelectedFloor, setArrayOfSelectedFloor] = useState(Array.from({ length: 10 }))
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
    const copySelectedFloor = [...arrayOfSelectedFloor]
    copySelectedFloor[selectedFloor] = 'pending'

    setArrayOfSelectedFloor(copySelectedFloor)
    const nearestElevator = findNearestElevator(elevatorLocation, selectedFloor);
    console.log(nearestElevator)
    const { elevatorId, floor, isElevatorActive } = nearestElevator
    refSetTimeout[elevatorId] = setTimeout(() => handleRemoveActive(elevatorId, selectedFloor), selectedFloor * 500)
    refSetInterval[elevatorId] = setInterval(() => handleInterval(elevatorId, selectedFloor), 500)
  }

  function handleInterval(id, selectedFloorForCount) {
    setElevatorLocation((prev) => {
      let currentFloor = prev[id].floor

      if (currentFloor >= selectedFloorForCount) {
        clearInterval(refSetInterval[id])
        delete refSetInterval[id];
        return { ...prev, [id]: { floor: selectedFloorForCount, isElevatorActive: true } }
      }

      return { ...prev, [id]: { floor: currentFloor += 1, isElevatorActive: true } }
    })
  }

  function handleRemoveActive(id, floor) {
    setArrayOfSelectedFloor(prev => [...prev, prev[floor] = 'arrived'])
    let audio = new Audio("https://audio-previews.elements.envatousercontent.com/files/148785970/preview.mp3");
    audio.play();
    setElevatorLocation(prev => ({ ...prev, [id]: { ...prev[id], isElevatorActive: false } }))
    delete refSetTimeout[id]
    clearTimeout(refSetTimeout[id])
    handleRemove(id, floor)
  }

  function handleRemove(id, floor) {
    let intervalid = setTimeout(() => {
      setArrayOfSelectedFloor(prev => [...prev, prev[floor] = undefined])
    }, 2000)
  }

  useEffect(() => {
    console.log(elevatorLocation)
  }, [elevatorLocation])

  return (
    <>
      <div className='flex justify-center items-center mt-5'>
        {
          totalElevator && Object.keys(totalElevator).map((ele) => {
            return (
              <div className='flex flex-col'>
                {
                  totalElevator[ele].map((floor) => {
                    return <Elevator arrayOfSelectedFloor={arrayOfSelectedFloor} floor={floor} ele={ele} elevatorLocation={elevatorLocation} handleSelectFloor={handleSelectFloor} />
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
