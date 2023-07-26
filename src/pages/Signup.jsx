import React from 'react'
import Header from '../components/Header'
import SignUpSignin from '../components/SignUpSignIn'

const Signup = () => {
    return (
        <div>
            <Header />
            <div className="wrapper">
                <SignUpSignin />
            </div>
        </div>
    )
}

export default Signup