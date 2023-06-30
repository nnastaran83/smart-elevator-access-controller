import {useSelector} from "react-redux";
import {FLOOR_MAP} from "../util/constants.js";

/**
 * This hook is used to get the current state of the user + registered users from the redux store.
 * and also calculate the VALID_COMMANDS and VALID_FLOOR_NUMBERS based on the registered users floor number.
 * @returns {{detectedUserInfo: unknown, VALID_COMMANDS: (string|T)[], userType: unknown, isVideoCallActive: unknown, requestedFloorNumber: unknown, VALID_FLOOR_NUMBERS: T[]}}
 */
export const useSiriData = () => {
    const {
        detectedUserInfo,
        userType,
        isVideoCallActive,
        requestedFloorNumber,
        registeredUsers
    } = useSelector(state => {
        return {
            detectedUserInfo: state.currentDetectedUser.detectedUserInfo,
            userType: state.currentDetectedUser.userType,
            isVideoCallActive: state.videoCall.isVideoCallActive,
            requestedFloorNumber: state.currentDetectedUser.requestedFloorNumber,
            registeredUsers: state.contactList.registeredUsers
        }
    });

    // Create a set of floor numbers from your array of objects
    const floorNumberSet = new Set(registeredUsers.map(obj => obj.floor_number));
    // Filter VALID_FLOOR_NUMBERS to only include numbers in the set
    const VALID_FLOOR_NUMBERS = Object.keys(FLOOR_MAP).filter(floor =>
        floorNumberSet.has(FLOOR_MAP[floor])
    );
    const VALID_COMMANDS = ['yes', 'no', ...VALID_FLOOR_NUMBERS];

    return {
        detectedUserInfo,
        userType,
        isVideoCallActive,
        requestedFloorNumber,
        VALID_COMMANDS,
        VALID_FLOOR_NUMBERS
    };
};

