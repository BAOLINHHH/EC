import React, { useState } from 'react'
import { AiFillEye,AiFillEyeInvisible  } from "react-icons/ai";
const UserPasswordToggle = () => {
    const [visible, setVisible] = useState(false);

    const IconInput = 
    (<span onClick={() => setVisible((prevVisible) => !prevVisible)} style={{ cursor: 'pointer' }} > {visible ? <AiFillEyeInvisible size={30} /> : <AiFillEye size={30}  />}</span>)
   
    
    const InputType = visible ? "text" : "password";
    
  return [InputType,IconInput];
}

export default UserPasswordToggle