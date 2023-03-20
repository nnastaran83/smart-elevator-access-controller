import React, {useState} from 'react';

const InviteForm = ({roomName}) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const sendSMS = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/send_sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({phone_number: phoneNumber, room_name: roomName}),
        });

        if (response.ok) {
            alert('SMS sent successfully!');
        } else {
            alert('Error sending SMS');
        }
    };

    return (
        <form onSubmit={sendSMS}>
            <label>
                Phone number:
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </label>
            <button type="submit">Send SMS</button>
        </form>
    );
};

export default InviteForm;
