import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const Updataikhoan = () => {
    const [hoTen, sethoTen] = useState('');
    const [email, setemail] = useState('');
    const [sdt, setsdt] = useState('');
    const [cmnd, setcccd] = useState('');
    const navigate = useNavigate();
    const [cookies] = useCookies(['user']);
    const [error, seterror] = useState({ cmnd: '', hoTen: '', sdt: '' });
    const [file, setFile] = useState(null);
    const [id, setid] = useState('');
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = cookies?.token;
            if (!token) return;

            try {
                const response = await axios.get(`http://localhost:8080/api/taikhoan/userid`, {
                    headers: { Authorization: ` ${token}` },
                });
                setemail(response.data.email);
                sethoTen(response.data.hoTen);
                setsdt(response.data.sdt);
                setcccd(response.data.cmnd);
                setid(response.data.id)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [cookies.token]);

    const validateForm = () => {
        let valid = true;
        const errorcopy = { cmnd: '', hoTen: '', sdt: '' };

        // if (!hoTen.trim()) {
        //     errorcopy.hoTen = 'Không được để trống';
        //     valid = false;
        // }
        // if (!sdt.trim()) {
        //     errorcopy.sdt = 'Không được để trống';
        //     valid = false;
        // }
        // if (!cmnd.trim()) {
        //     errorcopy.cmnd = 'Không được để trống';
        //     valid = false;
        // }

        seterror(errorcopy);
        return valid;
    };

    const savetaikhoan = async (e) => {
        e.preventDefault();
        const taikhoan = { hoTen, sdt, cmnd };

        if (validateForm()) {
            if(file==null){
                try {
                    console.log(id)
                    const token = cookies?.token;
                    if (!token) return;
    
                    await axios.put(`http://localhost:8080/api/taikhoan/update`, taikhoan, {
                        headers: { Authorization: ` ${token}` },
                    });
                    navigate('/listtaikhoan');
                } catch (error) {
                    console.error(error);
                }
            }else{
                try {
                    const token = cookies?.token;
                    if (!token) return;
    
                    await axios.put(`http://localhost:8080/api/taikhoan/update`, taikhoan, {
                        headers: { Authorization: ` ${token}` },
                    });
                    // const maTK = id;
                    
                    const formData = new FormData();
                    formData.append("file", file);
                    await axios.post(
                      `http://localhost:8080/api/taikhoan/upload/${id}`,formData  , 
                       {
                        headers: {
                          Authorization: `Bearer ${token}`, 
                          'Content-Type': 'multipart/form-data',
                        }
                       
                          }
                      
                    );
                    navigate('/listtaikhoan');
                } catch (error) {
                    console.error(error);
                }
               
            }
           
        }
    };

    const imagePreviewUrl = file ? URL.createObjectURL(file) : 'https://static.vecteezy.com/system/resources/previews/000/420/681/original/picture-icon-vector-illustration.jpg';

    return (
        <div>
            <div className="bg-body-secondary">
                <h2 className="text-center">CẬP NHẬT THÔNG TIN TÀI KHOẢN</h2>
            </div>
            <div className="row mt-2 mb-2">
                <div className="col-sm-10 offset-1 ">
                    <div className="row form">
                        <div className="col-6">
                            <form onSubmit={savetaikhoan}>
                                <div className="mb-3">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        className={`form-control ${error.email ? 'is-invalid' : ''}`}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setemail(e.target.value)}
                                        readOnly
                                    />
                                    {error.email && <div className='invalid-feedback'>{error.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label>Họ và tên:</label>
                                    <input
                                        type="text"
                                        className={`form-control ${error.hoTen ? 'is-invalid' : ''}`}
                                        placeholder="Họ và tên"
                                        value={hoTen}
                                        onChange={(e) => sethoTen(e.target.value)}
                                    />
                                    {error.hoTen && <div className='invalid-feedback'>{error.hoTen}</div>}
                                </div>
                                <div className="mb-3">
                                    <label>Số điện thoại:</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${error.sdt ? 'is-invalid' : ''}`}
                                        placeholder="Số điện thoại"
                                        value={sdt}
                                        onChange={(e) => setsdt(e.target.value)}
                                    />
                                    {error.sdt && <div className='invalid-feedback'>{error.sdt}</div>}
                                </div>
                                <div className="mb-3">
                                    <label>Căn cước công dân:</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${error.cmnd ? 'is-invalid' : ''}`}
                                        placeholder="Căn cước"
                                        value={cmnd}
                                        onChange={(e) => setcccd(e.target.value)}
                                    />
                                    {error.cmnd && <div className='invalid-feedback'>{error.cmnd}</div>}
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-outline-info form-control mb-1">Cập nhật</button>
                                    <button type="button" className="btn btn-outline-secondary form-control" onClick={() => navigate('/listtaikhoan')}>Quay lại</button>
                                </div>
                            </form>
                        </div>

                        <div className="col-5 ms-3 mt-3 d-flex flex-column align-items-center">
    {imagePreviewUrl && (
       <img
       src={imagePreviewUrl }
        
       alt="User Avatar"
       className="profile-avatar bg-3"
       style={{
           width: '40%',
           height: '180px',
           borderRadius: '50%',
           objectFit: 'cover',
           border: '2px solid #ccc' // Thêm viền để nổi bật ảnh hơn
       }}
   />
    )}
    <label className="mt-2">
  {/* Ảnh đại diện: */}
  {/* <img
    src="https://static.vecteezy.com/system/resources/previews/000/420/681/original/picture-icon-vector-illustration.jpg"
    // alt="Ảnh đại diện"
    style={{ width: "50px", height: "50px" }}
  /> */}
</label>
    <input type="file" onChange={handleFileChange} className="mt-1" />
</div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Updataikhoan;
