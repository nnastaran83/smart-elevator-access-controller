import React from 'react';
import {useNavigate} from 'react-router-dom';

/**
 * A Menu Button for navigation
 * @returns {JSX.Element}
 * @constructor
 */
const NavigationMenu = () => {

    const navigate = useNavigate();
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="nav-container">

            <div className="segmented-control">
                <input
                    onInput={() => handleNavigation('/')}
                    type="radio"
                    name="radio2"
                    defaultValue={1}
                    id="tab-1"

                />
                <label htmlFor="tab-1" className="segmented-control__1">
                    <i className="home icon"></i>
                </label>


                <input onInput={() => handleNavigation('/contactlist')}
                       type="radio"
                       name="radio2"
                       defaultValue={2}
                       id="tab-2"/>
                <label htmlFor="tab-2" className="segmented-control__2">
                    <p><i className="phone icon"></i> Video Call</p>
                </label>
                <div className="segmented-control__color"/>
            </div>


        </div>
    );

};

export default NavigationMenu;
/*
 <div className="ui bottom attached grey two item menu"
             style={{position: "sticky", bottom: "40px"}}>
            <a className="item" onClick={() => handleNavigation('/')}>
                <i className="home icon"></i>

            </a>
            <a className="item" onClick={() => handleNavigation('/contactlist')}>
                <i className="phone icon"></i>
                Video Call
            </a>
        </div>
 */