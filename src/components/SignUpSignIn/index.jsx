import React, { useState } from 'react'
import "./styles.css"
import Input from '../Input'
import Button from '../Button';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUpSignin = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginForm, setLoginForm] = useState(false);

    function signupWithEmail() {
        setLoading(true);   // when signup button clicked then loading will be shown on button
        console.log(name)
        console.log(email)
        console.log(password)
        console.log(confirmPassword)

        // User Authentication by email and password
        if (name != "" && email != "" && password != "" && confirmPassword != "") {

            if (password == confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        console.log("User>>>", user);
                        toast.success("User Created!");
                        setLoading(false);

                        // clear all input Fields
                        setName("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");

                        // Create Doc for user Authentication
                        createDoc(user);

                        // Navigate to Dashboard
                        navigate("/dashboard")
                    })
                    .catch((error) => {
                        setLoading(false);
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage);
                    });
            } else {
                toast.error("Password and confirmPassword Not Match!")
                setLoading(false);
            }
        } else {
            setLoading(false)
            toast.error("All Fields Are Mandatory!");
        }
    }

    async function createDoc(user) {
        setLoading(true);
        // Make sure that the doc with the uid doesn't exist
        //create a doc to store User in Firebase Database
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
            setLoading(false);
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.diplayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                toast.success("Doc Created!");
            } catch (e) {
                toast.error(e.message);
            }
        } else {
            setLoading(false);
            // toast.error("Doc Already Exists");
        }

    }

    function loginUsingEmail() {
        setLoading(true);
        console.log("Email", email)
        console.log("password", password)

        if (email != "" && password != "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    toast.success("User Logged In!");
                    console.log("User Logged In", user);
                    setLoading(false);
                    // ...

                    // Navigate to Dashboard
                    navigate("/dashboard")

                    // createDoc(user);

                })
                .catch((error) => {
                    setLoading(false);
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                });
        } else {
            setLoading(false);
            setLoading(false)
            toast.error("All Fields Are Mandatory!");
        }
    }

    function googleAuth() {
        setLoading(true);
        try {
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;

                    setLoading(false);
                    console.log(user);
                    toast.success("User Authenticated!")

                    navigate("/dashboard");
                    createDoc(user);
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                    setLoading(false);
                    toast.error("errorMessage")
                });
        } catch (e) {
            setLoading(false);
            toast.error(e.message);
        }
    }

    return (
        <>
            {
                loginForm ?
                    <div className='singup-wrapper'>
                        <h2 className="title">
                            Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
                        </h2>
                        <form>

                            <Input type={"email"} label={"Email"} placeholder={"JohnDoe@gmail.com"} state={email} setState={setEmail} />
                            <Input type={"password"} label={"Password"} placeholder={"Example@123"} state={password} setState={setPassword} />

                            <Button text={loading ? "Loading..." : "Login Using Email & Password"} onClick={loginUsingEmail} disabled={loading} />

                            <p className='p-login1' >or</p>
                            <Button onClick={googleAuth} text={loading ? "Loading..." : "Login Using Google"} blue={true} />
                            <p className='p-login' onClick={() => setLoginForm(!loginForm)} >Or Don't Have An Account Already? Click Here</p>
                        </form>
                    </div > :
                    <div className='singup-wrapper'>
                        <h2 className="title">
                            Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
                        </h2>
                        <form>
                            <Input type={"text"} label={"Full Name"} placeholder={"John Doe"} state={name} setState={setName} />
                            <Input type={"email"} label={"Email"} placeholder={"JohnDoe@gmail.com"} state={email} setState={setEmail} />
                            <Input type={"password"} label={"Password"} placeholder={"Example@123"} state={password} setState={setPassword} />
                            <Input type={"password"} label={"Confirm Password"} placeholder={"Example@123"} state={confirmPassword} setState={setConfirmPassword} />

                            <Button text={loading ? "Loading..." : "SignUp Using Email & Password"} onClick={signupWithEmail} disabled={loading} />

                            <p className='p-login1'>or</p>
                            <Button onClick={googleAuth} text={loading ? "Loading..." : "SignUp Using Google"} blue={true} />
                            <p className='p-login' onClick={() => setLoginForm(!loginForm)}>Or Have An Account Already? Click Here</p>
                        </form>
                    </div >
            }
        </>
    )
}

export default SignUpSignin