import React, { useEffect, useState } from "react";

const LienHe = () => {


    return (
        <>
            
            <main className="container">

                <div>
                    <div className="row mt-2">
                        <div className="">
                            <h2 className="text-center">Liên Hệ</h2>
                        </div>
                        <div className="col-sm-8" style={{ marginBlockStart: '100px' }}>
                            <div className="row text-center">
                                <div className="col-sm-4 text-center mb-4">
                                    <i className="fa-solid fa-map-location-dot" style={{ fontSize: '80px' }}></i>
                                    <p>Địa Chỉ</p>
                                    <p>Cái Răng Cần Thơ</p>
                                </div>
                                <div className="col-sm-4 text-center mb-4">
                                    <i className="fa-solid fa-phone-volume" style={{ fontSize: '80px' }}></i>
                                    <p>Điện Thoại</p>
                                    <p>+0123456789</p>
                                </div>
                                <div className="col-sm-4 text-center mb-4">
                                    <i className="fa-solid fa-envelope-open-text" style={{ fontSize: '80px' }}></i>
                                    <p>Địa Chỉ</p>
                                    <p>A@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                    <div className="row mt-4">
                       
                        <div className="col-sm-5">
                            <div className="bando-container mb-4">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1658.849010098746!2d105.75773277778848!3d9.982679713361225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e1!3m2!1svi!2s!4v1716249359128!5m2!1svi!2s" width="650" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-5">
                            <h2 className="mb-4">LIÊN HỆ</h2>
                            <div>
                                <p className="mb-3"><input type="text" placeholder="Tên" className="form-control" /></p>
                                <p className="mb-3"><input type="email" placeholder="Email" className="form-control" /></p>
                                <p className="mb-3"><input type="number" placeholder="Điện Thoại" className="form-control" /></p>
                                <p className="mb-3"><textarea type="text" placeholder="Phản Hồi" className="form-control" style={{ height: '100px' }}></textarea></p>
                                <button type="submit" className="btn btn-success">Gửi</button>
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                </div>
            </main>
           
        </>
    )
}

export default LienHe;