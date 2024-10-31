import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { listtaikhoan } from '../services/taikhoanservice';
import { useNavigate } from 'react-router-dom';
const Listtaikhoan = () => {

    const [taikhoan, settaikhoan] = useState([])
    const navigator = useNavigate();
    useEffect(() => {
        listtaikhoan().then((Response) => {
            settaikhoan(Response.data)
        }).catch(error => {
            console.error(error);
        })

    }, []
    )


    function addnewtaikhoan() {
        navigator('/addtaikhoan')
    }
    function updatetaikhoan(maTK) {
        navigator(`/updatetaikhoan/${maTK}`)
    }
    return (

        <main>
            <div>
                <button
                    type="button"
                    class="btn btn-primary mb-2" onClick={addnewtaikhoan}

                >
                    Button
                </button>

                <div
                    class="table-responsive"
                >
                    <table
                        class="table table-primary"
                    >
                        <thead>
                            <tr>
                                <th>matk</th>
                                <th >ten</th>
                                <th >matkhau</th>
                                <th >emall</th>
                                <th >sdt </th>
                                <th >actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {taikhoan.map(a =>
                                <tr key={a.id} >
                                    <td >{a.maTK}</td>
                                    <td >{a.hoTen}</td>
                                    <td>{a.matKhau}</td>
                                    <td>{a.email}</td>
                                    <td>{a.sdt}</td>
                                    <td>
                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            onClick={() => updatetaikhoan(a.id)}>
                                            Button
                                        </button>

                                    </td>

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </main>

    )
}
export default Listtaikhoan;