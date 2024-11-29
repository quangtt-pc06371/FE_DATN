import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
// const token = Cookies.get('token'); 
const Logout = () => {
    
    // const [, , removeCookie] = useCookies(['user','role'])
    console.log(typeof removeCookie);
    const navigator = useNavigate();
    const handleRemoveCookie= ()=> {
        Cookies.remove("token")
        Cookies.remove("refreshtoken")
        // removeCookie('user',
        //      { path: 'http://localhost:3000/' }
        //     );
        //     removeCookie('role',
        //         { path: 'http://localhost:3000/' }
        //        );
        
               navigator('/')
    }
    return (
        <button className="btn btn-secondary dropdown-item" type="button" onClick={handleRemoveCookie}>
        <i class="fa-solid fa-arrow-right-from-bracket"></i>    Đăng xuất
        </button>
    )



}
export default Logout;