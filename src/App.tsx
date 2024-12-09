import { useEffect, useState } from "react";
import "./App.css";
import Elevator from "./components/Elevator";

type ElevatorData = {
  [key: number]: number[];
};

type ElevatorLocation = {
  [key: number]: { floor: number; isElevatorActive: boolean };
};

function App() {
  const [totalElevator, setTotalElevator] = useState<ElevatorData>({});
  const [elevatorLocation, setElevatorLocation] = useState<ElevatorLocation>({
    2: { floor: 0, isElevatorActive: false },
    3: { floor: 0, isElevatorActive: false },
    4: { floor: 0, isElevatorActive: false },
    5: { floor: 0, isElevatorActive: false },
    6: { floor: 0, isElevatorActive: false },
  });

  const [selectedFloors, setSelectedFloors] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const obj: ElevatorData = {};
    for (let i = 1; i <= 7; i++) {
      const arr: number[] = [];
      for (let j = 1; j <= 10; j++) {
        arr.push(10 - j);
      }
      obj[i] = arr;
    }
    setTotalElevator(obj);
  }, []);

  const handleClick = (floor: number) => {
    const copySelectedFloors = { ...selectedFloors };
    copySelectedFloors[floor] = "pending";
    setSelectedFloors(copySelectedFloors);

    // Find an idle elevator to move
    const availableElevator = Object.keys(elevatorLocation).find(
      (key) => !elevatorLocation[parseInt(key)].isElevatorActive
    );

    if (availableElevator) {
      const elevatorId = parseInt(availableElevator);
      moveElevator(elevatorId, floor);
    }
  };

  const moveElevator = (elevatorId: number, targetFloor: number) => {
    const currentLocation = elevatorLocation[elevatorId];
    if (!currentLocation) return;

    const updatedLocation = { ...elevatorLocation };
    updatedLocation[elevatorId].isElevatorActive = true;
    setElevatorLocation(updatedLocation);

    const moveInterval = setInterval(() => {
      setElevatorLocation((prev) => {
        const nextLocation = { ...prev };

        const currentFloor = nextLocation[elevatorId].floor;

        if (currentFloor === targetFloor) {
          clearInterval(moveInterval);
          nextLocation[elevatorId].isElevatorActive = false;

          // Update the selected floor state to 'Arrived'
          setSelectedFloors((prevFloors) => {
            const updatedFloors = { ...prevFloors };
            updatedFloors[targetFloor] = "arrived";
            return updatedFloors;
          });

          // Reset state after a delay
          setTimeout(() => {
            setSelectedFloors((prevFloors) => {
              const resetFloors = { ...prevFloors };
              delete resetFloors[targetFloor];
              return resetFloors;
            });
          }, 2000);
        } else {
          nextLocation[elevatorId].floor =
            currentFloor < targetFloor ? currentFloor + 1 : currentFloor - 1;
        }

        return nextLocation;
      });
    }, 1000);
  };

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold flex justify-center items-center">
        Elevator Exercise
      </h1>

      <div className="flex justify-center items-center mt-5">
        {totalElevator &&
          Object.keys(totalElevator).map((elevator) => {
            const elevatorId = parseInt(elevator);
            return (
              <div className="flex flex-col" key={elevatorId}>
                {totalElevator[elevatorId].map((TotalFloor, index) => {
                  return (
                    <Elevator
                      key={index}
                      TotalFloor={TotalFloor}
                      elevator={elevatorId}
                      elevatorLocation={elevatorLocation}
                      selectedFloors={selectedFloors}
                      handleClickSelectedFloor={handleClick}
                    />
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
