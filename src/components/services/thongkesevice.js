import axios from "axios";
import request from "./config";
const API_HOADONCT = 'http://localhost:8080/api/thongke';
export const thongketheonam = (id) => axios.get(API_HOADONCT+ '/' +id);