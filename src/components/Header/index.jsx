import React, { useEffect } from 'react'
import './styles.css'
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

const Header = () => {

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, loading])

    function myFunc() {
        try {
            signOut(auth)
                .then(() => {
                    toast.success("Logged Out Successfully!");
                    navigate("/");
                })
                .catch(e => {
                    toast.error(e.message);
                })
        } catch (e) {
            toast.error(e.message);
        }
    }
    return (
        <div className="navbar">
            <p className="logo">Financely.</p>
            {user && <p className="logo link" onClick={myFunc}>Logout</p>}
        </div>
    )
}

export default Header