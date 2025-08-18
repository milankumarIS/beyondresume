import { createAxiosClient } from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

// const BASE_URL = 'https://mydailylives.com/api/v2/'
// const BASE_URL = 'http://localhost:4000/api/v2/'
// const BASE_URL = 'https://br.skillablers.com//api/v2/'
const BASE_URL = 'https://brdev.skillablers.com//api/v2/'



export function getCurrentAccessToken() {
    return localStorage.getItem('accessToken');
}

export function isLoggedIn() {
    if (localStorage.getItem('accessToken')) {
        return true;
    }
    else {
        return false;
    }
}



export function setCurrentAccessToken(accessToken: any) {
    return localStorage.setItem('accessToken', accessToken)
}

export function getUserRole(): string {
    let userRole: any = localStorage.getItem('userRole');
    if (userRole) {
        return userRole?.split('_')[0] || 'undefined';
    }
    else {
        return 'undefined';
    }
}


export function getUserSelectedModuleId(): string {
    let userRole: any = localStorage.getItem('userRole');
    if (userRole) {
        return userRole?.split('_')[1] || 'undefined';
    }
    else {
        return 'undefined';
    }
}

export function getUserSelectedModuleName(): string {
    let userRole: any = localStorage.getItem('userRole');
    if (userRole) {
        return userRole?.split('_')[2] || 'undefined';
    }
    else {
        return 'undefined';
    }
}


export function getUserSelectedModuleCode(): string {
    let userRole: any = localStorage.getItem('userRole');
    if (userRole) {
        return userRole?.split('_')[3] || 'undefined';
    }
    else {
        return 'undefined';
    }
}

export function setUserRole(userRole: string) {
    return localStorage.setItem('userRole', userRole)
}


export function removeUserRole() {
    return localStorage.removeItem('userRole')
}


export function getUserGender(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.gender || ' ';
    }
    else {
        return ' ';
    }
}


export function getUserAge(): number {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded?.userPersonalInfo?.age || 0;
    }
    else {
        return 0;
    }
}


export function getUserId(): number {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.userId || 0;
    }
    else {
        return 0;
    }
}

//supervisorCode
export function getSupervisorCode(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.supervisorCode || "";
    }
    else {
        return "0";
    }
}


export function getUserLoginMethod(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.loginMethod || 'WEB';
    }
    else {
        return 'WEB';
    }
}


export function getDriverId(): number {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.driverId || 0;
    }
    else {
        return 0;
    }
}


export function getUserName(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.userName || '';
    }
    else {
        return '';
    }
}



export function getUserContact(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded?.userContact?.userPhoneNumber || '';
    }
    else {
        return '';
    }
}


export function getUserFirstName(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded?.userPersonalInfo?.firstName || '';
    }
    else {
        return '';
    }
}

export function getUserCode(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.userDailyLifeCode || '';
    }
    else {
        return '';
    }
}


export function getUserEmail(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded?.userContact?.userEmail || '';
    }
    else {
        return '';
    }
}


export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL,
        timeout: 300000,
        headers: {
        }
    },
    getCurrentAccessToken,
})