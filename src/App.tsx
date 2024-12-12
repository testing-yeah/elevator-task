/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import Elevator from "./components/Elevator";

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
  const [pendingFloors, setPendingFloors] = useState<number[]>([]);

  useEffect(() => {
    const obj: ElevatorData = {};
    for (let i = 1; i <= 7; i++) {
      const Arr = [];
      for (let j = 1; j <= 10; j++) {
        Arr.push(10 - j);
      }
      obj[i] = Arr;
    }
    setTotalElevator(obj);
  }, []);

  useEffect(() => {
    const processPendingFloors = () => {
      if (pendingFloors.length === 0) return;

      for (const floor of pendingFloors) {
        const nearestElevator = findNearestElevator(floor);

        if (nearestElevator.elevatorId !== null) {
          setPendingFloors((prev) => prev.filter((f) => f !== floor));
          assignElevatorToFloor(
            nearestElevator.elevatorId,
            floor,
            nearestElevator.distance
          );
          break;
        }
      }
    };

    const id = setInterval(processPendingFloors, 100);
    return () => clearInterval(id);
  }, [pendingFloors, elevatorLocation]);

  const handleClick = (floor: number) => {
    setSelectedFloors((prev) => ({
      ...prev,
      [floor]: "pending",
    }));

    const nearestElevator = findNearestElevator(floor);

    console.log("nearestElevator", nearestElevator);

    if (nearestElevator.elevatorId === null) {
      setPendingFloors((prev) => [...prev, floor]);
    } else {
      assignElevatorToFloor(
        nearestElevator.elevatorId,
        floor,
        nearestElevator.distance
      );
    }
  };

  const assignElevatorToFloor = (
    elevatorId: number | null,
    floor: number,
    distance: number
  ) => {
    if (elevatorId === null) return;

    setSelectedFloors((prev) => ({
      ...prev,
      [floor]: "pending",
    }));

    setElevatorLocation((prev) => ({
      ...prev,
      [elevatorId]: {
        ...prev[elevatorId],
        destinationFloor: floor,
        differenceFloor: distance,
      },
    }));

    moveElevator(elevatorId, floor);
  };

  const findNearestElevator = (floor: number) => {
    return Object.entries(elevatorLocation).reduce(
      (
        closestElevator: { elevatorId: number | null; distance: number },
        [elevatorIdStr, { floor: currentFloor, isElevatorActive }]
      ) => {
        const elevatorId = parseInt(elevatorIdStr, 10);

        if (isElevatorActive) return closestElevator;

        const distance = Math.abs(currentFloor - floor);

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
            setElevatorLocation((prev) => ({
              ...prev,
              [elevatorId]: { ...prev[elevatorId], isElevatorActive: false },
            }));

            setSelectedFloors((prev) => {
              const { [targetFloor]: _, ...rest } = prev;
              return rest;
            });
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
        {Object.entries(totalElevator)?.map(([elevator, floor]) => (
          <div className="flex flex-col" key={elevator}>
            {floor?.map((floors: number, index: number) => (
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
