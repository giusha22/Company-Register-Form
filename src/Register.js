import { useRef, useState, useEffect } from "react"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register'

export const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName,setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd,setValidPwd] = useState(false);
  const [pwdFoucs, setPwdFocus] = useState(false);


  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch,setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(()=>{
      const result = USER_REGEX.test(user)
      console.log(result);
      console.log(user);
      setValidName(result)
    },[user]);

    useEffect(()=>{
        setValidPwd(PWD_REGEX.test(pwd));
        const match = pwd === matchPwd;
        setValidMatch(match)
    },[pwd,matchPwd]);

    useEffect(()=>{
      setErrMsg(''); 
    },[user,pwd, matchPwd])

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL, JSON.stringify({ user, pwd }),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            },
        )
            console.log(response?.data);
            setSuccess(true)

        } catch (err) {
          if (!err?.response) {
            setErrMsg('No Server Response')
            console.log(err.message);
          } else if (err.response?.status === 409) {
            setErrMsg('Username Taken')
            console.log(err.message);

          } else {
            setErrMsg('Registration Failed')
            console.log(err.message);

          }
        }
    }

  return (
    <>
      { success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ):(
      <section>
        <p 
          ref={errRef} 
          className={errMsg ? "errmsg": "offscreen"}
          aria-live="assertive"
        >{errMsg}</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username"> Username:</label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            ref={userRef}
            onChange={(e) => setUser(e.target.value)}
            required
            aria-invalid={validName ? 'false': 'true'}
            aria-describedby="uidnote"
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
          />
          <label htmlFor="password">password: </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            required
            aria-invalid={ validPwd ?'false': 'true' }
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <label htmlFor="confirm_pwd">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            required
            aria-invalid={ validMatch ?'false': 'true' }
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <button disabled={ !validName || !validPwd || !validMatch ? true : false }>Sign Up</button>
        </form>
        <p> Already register?
          <br/> 
          <span className="line">
            <a href="#">Sign In</a>
          </span>
        </p>
      </section>
      )}
    </>
  )
}
