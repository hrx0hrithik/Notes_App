import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup(props) {

  const [credentials, setCredentials] = useState({name: "",email: "", password: "", cpassword: ""})
  let history = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const {name, email, password} = credentials;
    const response = await fetch(`https://note-app-backend-zb7r.onrender.com/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name, email, password})
    });
    const json = await response.json();
    console.log(json);
    if (json.success){
      // Save the auth token and redirect
      history("/")
      props.showAlert("Account Created Successfully", "success")
      localStorage.setItem('token', json.authToken);

    }else{
      props.showAlert("Invalid Credentials", "danger")
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className='container mt-2'>
      <h2 className='my-2'>Create an account to use My Notebook</h2>
      <form className='position-relative' onSubmit={handleSubmit}>
  <div className="my-3">
    <label htmlFor="name" className="form-label">Full Name</label>
    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" placeholder='eg. Jhon Curry' required/>
  </div>

  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" placeholder='email@email.com' required/>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label" required>Create Password</label>
    <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required   />
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label" required>Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required   />
  </div>

  <button type="reset" className="btn btn-secondary mx-2">Cancel</button>
  <button type="submit" className="btn btn-primary mx-2">Submit</button>
</form>
    </div>
  )
}

export default Signup
