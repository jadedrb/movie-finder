import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { auth } from '../firebase'

const Login = () => {

    const history = useHistory()
    const user = useSelector(state => state.user)

    let [login, setLogin] = useState(true)
    let emailRef = useRef()
    let passwordRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()

        let email = emailRef.current.value
        let password = passwordRef.current.value

        if (login) {
            auth.signInWithEmailAndPassword(email, password)
                .then((cred) => successfulAttempt(cred, 'Login successful! Welcome '))
                .catch(() => failedAttempt('No such user found.'))
        }
        else {
            auth.createUserWithEmailAndPassword(email, password)
                .then((cred) => successfulAttempt(cred, 'Signup successful! Hello '))
                .catch(() => failedAttempt('Invalid email or password.'))
        }
    }

    const successfulAttempt = (c, msg) => {
        history.push('/')
        
        alert(msg + c.user.email)
        console.log(c)
        console.log('^')
    }

    const failedAttempt = (msg) => {
        alert(msg)
        emailRef.current.value = ''
        passwordRef.current.value = ''
    }


    useEffect(() => {
        // if (user) {
        //     auth.signOut()
        //         .then(() => "user logged out...")
        // }
        console.log(history.location.pathname)
        if (history.location.pathname === '/Logout') {
            auth.signOut()
                .then(() => {
                    alert('You have successfully logged out')
                    history.push('/')
                })
        }
    }, [])

    return ( 
        <div id='login'>
            <h1>{login ? "Login" : "Sign Up"}</h1>
            <form onSubmit={handleSubmit}>
                <input ref={emailRef} type="email" />
                <input ref={passwordRef} type="password" />
                <button>{login ? "Login" : "Sign Up"}</button>
            </form>
            <div onClick={() => setLogin(!login)}>Don't have an account?</div>
        </div>
    );
}
 
export default Login;