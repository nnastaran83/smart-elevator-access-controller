/**
 * Auth token we will use to generate a meeting and connect to it
 * @type {string}
 */
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIzN2U0ZThhMC1hYjk2LTQyNTUtOGQ2Zi1kNzc1MTU5NzI0MzYiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4MTg1NTExNywiZXhwIjoxODM5NjQzMTE3fQ.B28RA4aVuEnYcoDuzqj1JmTCULG6eaMV1IswmIDnE14";
/**
 * API call to create meeting
 * @param token
 * @returns {Promise<*>}
 */
export const createMeeting = async ({token}) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${authToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    //Destructuring the roomId from the response
    const {roomId} = await res.json();
    return roomId;
};