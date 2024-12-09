import ElevatorSvg from "../assets/elevator";

type ElevatorLocation = {
    [key: number]: { floor: number; isElevatorActive: boolean };
};

type ElevatorProps = {
    TotalFloor: number;
    elevator: number;
    elevatorLocation: ElevatorLocation;
    selectedFloors: { [key: number]: string };
    handleClickSelectedFloor: (floor: number) => void;
};

const Elevator: React.FC<ElevatorProps> = ({
    TotalFloor,
    elevator,
    elevatorLocation,
    selectedFloors,
    handleClickSelectedFloor,
}) => {
    if (elevator === 1) {
        return (
            <div className="w-24 h-20 flex justify-center items-center">
                {TotalFloor === 0 ? "Ground Floor" : `Floor ${TotalFloor}`}
            </div>
        );
    }

    if (elevator > 1 && elevator < 7) {
        const isAtCurrentFloor = elevatorLocation[elevator]?.floor === TotalFloor;

        return (
            <div className="w-24 h-20 border border-gray-400 flex justify-center items-center">
                {isAtCurrentFloor && (
                    <div className="w-12">
                        <ElevatorSvg />
                    </div>
                )}
            </div>
        );
    }

    if (elevator === 7) {
        const floorStatus = selectedFloors[TotalFloor] || "";
        return (
            <button
                className={`w-24 h-20 flex justify-center items-center ${floorStatus === "pending"
                        ? "bg-red-600"
                        : floorStatus === "arrived"
                            ? "bg-transparent border"
                            : "bg-green-500"
                    } ml-3`}
                onClick={() => handleClickSelectedFloor(TotalFloor)}
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
