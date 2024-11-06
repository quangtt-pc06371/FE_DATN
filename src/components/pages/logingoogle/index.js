import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from "js-cookie";
 const  logingoogle =() =>{
   
    const handleSuccess = async () => {
        try {
            // const token = Cookies.get('token'); 
            const result = await axios.post('http://localhost:8080/api/taikhoan/google');
            console.log("Đăng ký/Đăng nhập thành công:", result.data);
        } catch (error) {
            console.log("Đăng ký/Đăng nhập thất bại:", error);
        }
    };

    const handleFailure = (error) => {
        console.log("Login Failed:", error);
    };

    return (
        <GoogleOAuthProvider clientId="723213997945-fihuct7hjfk5hnthvr1rogb5gev5g6j8.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleSuccess}
                onFailure={handleFailure}
            />
        </GoogleOAuthProvider>
    );
}
export default  logingoogle