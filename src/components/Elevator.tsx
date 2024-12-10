import ElevatorSvg from "../assets/elevator";

type ElevatorLocation = {
    [key: number]: {
        floor: number;
        isElevatorActive: boolean;
        destinationFloor?: number;
        differenceFloor?: number;
    };
};

type ElevatorProps = {
    floors: number;
    elevator: number;
    elevatorLocation: ElevatorLocation;
    selectedFloors: { [key: number]: string };
    handleClickSelectedFloor: (floor: number) => void;
};

const Elevator: React.FC<ElevatorProps> = ({
    floors,
    elevator,
    elevatorLocation,
    selectedFloors,
    handleClickSelectedFloor,
}) => {
    if (elevator === 1) {
        return (
            <div className="w-24 h-16 flex justify-center items-center">
                {floors === 0 ? "Ground Floor" : `Floor ${floors}`}
            </div>
        );
    }

    if (elevator > 1 && elevator < 7) {
        const isAtCurrentFloor = elevatorLocation[elevator]?.floor === floors;
        const travelTime = (elevatorLocation[elevator]?.differenceFloor ?? 0) * 500;

        return (
            <div className="w-32 h-16 border border-gray-400 flex justify-center items-center">
                {isAtCurrentFloor && (
                    <div className="w-12">
                        <ElevatorSvg />
                    </div>
                )}
                {!isAtCurrentFloor &&
                    elevatorLocation[elevator]?.destinationFloor == floors && (
                        <div>{travelTime} Sec</div>
                    )}
            </div>
        );
    }

    if (elevator === 7) {
        const floorStatus = selectedFloors[floors] || "";
        const isButtonDisabled =
            selectedFloors[floors] === "pending" ||
            selectedFloors[floors] === "arrived";

        return (
            <button
                className={`w-28 h-16 flex justify-center items-center ${floorStatus === "pending"
                    ? "bg-red-600"
                    : floorStatus === "arrived"
                        ? "bg-transparent border"
                        : "bg-green-500"
                    } ml-3`}
                onClick={() => handleClickSelectedFloor(floors)}
                disabled={isButtonDisabled}
            >
                {floorStatus === "pending"
                    ? "Waiting"
                    : floorStatus === "arrived"
                        ? "Arrived"
                        : "Call"}
            </button>
        );
    }

    return null;
};

export default Elevator;
