import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import WorkoutGuy from '../../../Assets/WorkoutGuy.png';
import { AuthContext } from '../../../services/AuthContext';
import LogoutIcon from '../../../Assets/Icons/icons8-logout-64.png'

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isLoginPage = location.pathname === '/login';

    const handleLogoClick = () => {
        navigate('/dashboard');
    };

    return (
        <header className='main-header'>
            <div className='logo' onClick={handleLogoClick}>
                <img src={WorkoutGuy} className='image' alt="workout illustration" />
                <div className='header-text'>Gymify</div>
            </div>
            {!isLoginPage && (
                <div className='button-group'>
                    <button className='logout-button' onClick={handleLogout}>
                        <img src={LogoutIcon} alt="logout icon" />
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
