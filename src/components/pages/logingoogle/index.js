import { auth, GoogleAuthProvider, signInWithPopup } from "../../../config/firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
const signInWithGoogle = async () => {
    // const [cookies, setCookie] = useCookies(["user"]);
  const provider = new GoogleAuthProvider();
 
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Gửi token về Spring Boot để xác thực
    const response = await axios.post(
      "http://localhost:8080/api/taikhoan/google", 
      { token: idToken }, // Gửi token trong đối tượng JSON
      { headers: { "Content-Type": "application/json" } }
    );
    const { token, refreshToken } = response.data;
    
    Cookies.set('token',token); 
   Cookies.set('refreshToken',refreshToken); 
    console.log(idToken);
    // In ra kết quả từ server
    console.log("Response from backend: ", response.data);
   
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
  }
};

const GoogleLoginButton = () => {
  return <button onClick={signInWithGoogle}>Đăng nhập bằng Google</button>;
};

export default GoogleLoginButton;
