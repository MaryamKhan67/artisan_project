import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localStorage
        localStorage.clear();

        // Redirect to homepage
        navigate('/');
    }, [navigate]);

    return null;
};

export default UserLogout;
