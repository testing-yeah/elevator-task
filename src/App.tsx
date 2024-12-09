/* eslint-disable @typescript-eslint/no-unused-vars */
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
    setTotalElevator(
      Array.from({ length: 7 }, (_, i) => ({
        [i + 1]: Array.from({ length: 10 }, (_, j) => 9 - j),
      })).reduce((acc, obj) => ({ ...acc, ...obj }), {})
    );
  }, []);

  const handleClick = (floor: number) => {
    if (selectedFloors[floor] === "pending") return;

    setSelectedFloors((prev) => ({ ...prev, [floor]: "pending" }));

    const nearestElevator = Object.entries(elevatorLocation).reduce(
      (
        closestElevator: { elevatorId: number | null; distance: number },
        [elevatorIdStr, { floor: currentFloor, isElevatorActive }]
      ) => {
        const elevatorId = parseInt(elevatorIdStr, 10);

        if (isElevatorActive) return closestElevator;

        const distance =
          currentFloor < floor ? floor - currentFloor : currentFloor - floor;

        if (!closestElevator || distance < closestElevator.distance) {
          return { elevatorId, distance };
        }

        return closestElevator;
      },
      { elevatorId: null, distance: Infinity }
    );

    if (nearestElevator.elevatorId !== null) {
      moveElevator(nearestElevator.elevatorId, floor);
    }
  };

  const moveElevator = (elevatorId: number, targetFloor: number) => {
    const audio = new Audio(
      "https://audio-previews.elements.envatousercontent.com/files/148785970/preview.mp3"
    );

    if (elevatorLocation[elevatorId]?.isElevatorActive) return;

    setElevatorLocation((prev) => ({
      ...prev,
      [elevatorId]: { ...prev[elevatorId], isElevatorActive: true },
    }));

    const moveInterval = setInterval(() => {
      setElevatorLocation((prev) => {
        const { floor: currentFloor } = prev[elevatorId];

        if (currentFloor === targetFloor) {
          clearInterval(moveInterval);

          audio.play();

          setSelectedFloors((prev) => ({ ...prev, [targetFloor]: "arrived" }));

          setTimeout(() => {
            setSelectedFloors((prev) => {
              const { [targetFloor]: _, ...rest } = prev;
              return rest;
            });
          }, 2000);

          return {
            ...prev,
            [elevatorId]: { ...prev[elevatorId], isElevatorActive: false },
          };
        }

        return {
          ...prev,
          [elevatorId]: {
            ...prev[elevatorId],
            floor:
              currentFloor < targetFloor ? currentFloor + 1 : currentFloor - 1,
          },
        };
      });
    }, 1000);
  };

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold flex justify-center items-center">
        Elevator Exercise
      </h1>

      <div className="flex justify-center items-center mt-5">
        {Object.entries(totalElevator).map(([elevator, floors]) => (
          <div className="flex flex-col" key={elevator}>
            {floors.map((TotalFloor: number, index: number) => (
              <Elevator
                key={index}
                TotalFloor={TotalFloor}
                elevator={parseInt(elevator)}
                elevatorLocation={elevatorLocation}
                selectedFloors={selectedFloors}
                handleClickSelectedFloor={handleClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
