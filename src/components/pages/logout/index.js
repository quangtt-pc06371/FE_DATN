import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    
    const [, , removeCookie] = useCookies(['token','refreshToken'])
    console.log(typeof removeCookie);
    const navigator = useNavigate();
    const handleRemoveCookie= ()=> {
        removeCookie('token',
             { path: 'http://localhost:3000/' }
            );
            removeCookie('refreshToken',
                { path: 'http://localhost:3000/' }
               );
               navigator('/')
               window.location.reload()
    }
    return (
        <button className="btn btn-secondary dropdown-item" type="button" onClick={handleRemoveCookie}>
        <i class="fa-solid fa-arrow-right-from-bracket"></i>    Đăng xuất
        </button>
    )



}
export default Logout;