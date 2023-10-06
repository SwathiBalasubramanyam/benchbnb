import { useDispatch, useSelector } from "react-redux"
import { useState } from "react";
import { signUp } from "../../store/session";
import { Redirect } from "react-router-dom";


const SignUpFormPage = () => {

    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState([]);

    if (sessionUser) return <Redirect to="/" />
    const handleErrors = async (res) => {
        let data;
        try {
            data = await res.json();
        } catch {
            data = await res.text(); // Will hit this case if the server is down
        }
        if (data?.errors) setErrors(data.errors);
        else if (data) setErrors([data]);
        else setErrors([res.statusText]);   
    }

    const handlesignUp = async (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(signUp({ email, username, password })).catch(handleErrors);
    }

    return (
        <form onSubmit={handlesignUp}>
            <ul>
                {errors.map(error => <li key={error}>{error}</li>)}
            </ul>
            <label>Email
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </label>
            <label>Username
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            </label>
            <label>Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </label>
            <button type="submit">Sign Up</button>
        </form>
    )
}

export default SignUpFormPage;