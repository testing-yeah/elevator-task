/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import Elevator from "./components/Elevator";

// Types for state
type ElevatorData = {
  [key: number]: number[];
};

type ElevatorLocation = {
  [key: number]: {
    floor: number;
    isElevatorActive: boolean;
    destinationFloor?: number;
    differenceFloor?: number;
  };
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
    if (isElevatorAtFloorInactive(floor)) {
      setTimeout(() => {
        setSelectedFloors((prev) => {
          const { [floor]: _, ...rest } = prev;
          return rest;
        });
      }, 2000);

      return;
    }

    setSelectedFloors((prevSelectedFloor) => ({
      ...prevSelectedFloor,
      [floor]: "pending",
    }));

    const nearestElevator = findNearestElevator(floor);

    setElevatorLocation((prev) => ({
      ...prev,
      [nearestElevator.elevatorId as number]: {
        ...prev[nearestElevator.elevatorId as number],
        destinationFloor: floor,
        differenceFloor: nearestElevator.distance,
      },
    }));

    console.log("nearestElevator", nearestElevator);

    if (nearestElevator.elevatorId !== null) {
      moveElevator(nearestElevator.elevatorId, floor);
    }
  };

  // Function to check if any elevator is inactive at the selected floor
  const isElevatorAtFloorInactive = (floor: number) => {
    return Object.entries(elevatorLocation).find(
      ([, { floor: currentFloor, isElevatorActive }]) =>
        currentFloor === floor && !isElevatorActive
    );
  };

  // Function to find the nearest available elevator
  const findNearestElevator = (floor: number) => {
    return Object.entries(elevatorLocation).reduce(
      (
        closestElevator: { elevatorId: number | null; distance: number },
        [elevatorIdStr, { floor: currentFloor, isElevatorActive }]
      ) => {
        const elevatorId = parseInt(elevatorIdStr, 10);

        if (isElevatorActive) return closestElevator;

        const distance =
          currentFloor > floor ? currentFloor - floor : floor - currentFloor;

        if (
          closestElevator.elevatorId === null ||
          distance < closestElevator.distance
        ) {
          return { elevatorId, distance };
        }

        return closestElevator;
      },
      { elevatorId: null, distance: Infinity }
    );
  };

  const moveElevator = (elevatorId: number, targetFloor: number) => {
    if (elevatorLocation[elevatorId]?.isElevatorActive) return;

    const audio = new Audio(
      "https://audio-previews.elements.envatousercontent.com/files/148785970/preview.mp3"
    );

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

          setSelectedFloors((prev) => ({
            ...prev,
            [targetFloor]: "arrived",
          }));

          setTimeout(() => {
            setSelectedFloors((prev) => {
              const { [targetFloor]: _, ...rest } = prev;
              return rest;
            });

            setElevatorLocation((prev) => ({
              ...prev,
              [elevatorId]: { ...prev[elevatorId], isElevatorActive: false },
            }));
          }, 2000);

          return prev;
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
    }, 500);
  };

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-serif font-bold flex justify-center items-center">
        Elevator Exercise
      </h1>

      <div className="flex justify-center items-center mt-5">
        {Object.entries(totalElevator).map(([elevator, floor]) => (
          <div className="flex flex-col" key={elevator}>
            {floor.map((floors: number, index: number) => (
              <Elevator
                key={index}
                floors={floors}
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
