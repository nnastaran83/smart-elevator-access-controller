import React from 'react';
import {useNavigate} from 'react-router-dom';

const NavigationMenu = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (

        <div className="ui bottom attached grey two item menu" style={{position: "sticky", bottom: "40px"}}>
            <a className="item" onClick={() => handleNavigation('/')}>
                <i className="home icon"></i>

            </a>
            <a className="item" onClick={() => handleNavigation('/contactlist')}>
                <i className="phone icon"></i>
                Video Call
            </a>
        </div>
    );

};

export default NavigationMenu;
