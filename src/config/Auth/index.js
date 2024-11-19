import request from "../Apiconfig";

const loginApi = async ({ email, password }) => {
  const res = await request({
    method: "POST",
    path: "/api/auth/signin",
    data: {
      email: email,
      password: password,
    //   device: "website",
    },
  });

  return res;
};

const getProfile = async () => {
  const res = await request({
    method: "GET",
    path: "/api/taikhoan/profile",
    // data: data,
  });

  return res;
};
const postDucoment = async (data) => {
  console.log(data)
  const res = await request({
    method: "POST",
    path: "/api/sanpham",
    data: data,
  });

  return res;
};

export { loginApi, getProfile,postDucoment };