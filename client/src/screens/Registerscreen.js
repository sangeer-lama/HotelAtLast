import React , {useState} from 'react'
import axios from "axios";

import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function Registerscreen() {
  const[name,setname] =useState('')
  const[email,setemail] =useState('')
  const[password,setpassword] =useState('')
  const[cpassword,setcpassword] =useState('')

  
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [success,setsuccess] = useState();


  async function register(){
    if (password===cpassword)
    {
      const user={
        name,
        email,
        password,
        cpassword
      }
      try {
        setloading(true);
        const result =await axios.post('/api/users/register',user).data;
        setloading(false);
        setsuccess(true);
        setname('')
        setemail('')
        setpassword('')
        setcpassword('')
      } catch (error) {
        
        setloading(false);
        seterror(true);
      }
    }
    else{
      alert('Password not matched')
    }
  }

  return (
 <div className='regimg'>
      <div>
        {loading &&(<Loader/>)}
        {error&&(<Error/>)}
        <div className='row justify-content-center mt -5'>
          <div className='col-md-5 mt-5'>
          {success &&(<Success message='Registration success'/>)}

            <div className='bs '>
            <span><i class="fa fa-user-plus " style={{fontSize:'30px', position:'absolute'}} aria-hidden="true"></i></span><h2>Register</h2>
              <input type="text" className='form-control' style={{marginBottom: '10px'}} placeholder='name'
              value={name} onChange={(e)=>{setname(e.target.value)}}/>
              <input type="email" className='form-control' style={{marginBottom: '10px'}} placeholder='email'
              value={email} onChange={(e)=>{setemail(e.target.value)}}/>
              <input type="password" className='form-control' style={{marginBottom: '10px'}} placeholder='password'
              value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
              <input type="password" className='form-control' style={{marginBottom: '10px'}} placeholder='confirm password'
              value={cpassword} onChange={(e)=>{setcpassword(e.target.value)}}/>

              <button className='btn btn-primary mt-3'onClick={register}>Register</button>
            </div>
          </div>
        </div>
    </div>
 </div>
  )
}

export default Registerscreen