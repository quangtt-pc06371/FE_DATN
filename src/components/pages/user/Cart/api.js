export const BASE_URL = 'http://localhost:8080';

export const API ={
    Cart: '/api/cart',
    Order: '/api/order',
    Voucher: '/api/voucherbills',
    Address: '/api/addresses'
} 

export const CART = {
    List: '/list',
    Add: '/addDetail',
    Update: '/updateDetail',
    Delete: '/deleteDetail',
}

export const ORDER = {
    List: '/list',
    Add: '/create',
    VnPay: '/create-vnpay-url'
}

export const VOUCHER = {
    List: '/list',
    ApplyVoucher: '/apply-voucher',
}

export const ADDRESS = {
    List: '/list',
    Add: '/save',
    Update: '/update',
    Delete: '/delete'
}