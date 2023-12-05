import { server } from './hosts';
import { setUserState, getCurrUser } from './userState';
import axios from 'axios';

export const googleUserGetProfile = async (code) => {
    const url = new URL(`${server}/google-auth-provider/initGoogleLogin/callback`);
    url.searchParams.append('code', code);
    const dataRes = await axios.get(url);
    return dataRes;
}

export const googleGetGapiToken = () => {
    return sessionStorage.getItem('gapiToken')
}

export const googleUserSetSession = (jwt, gapi, user) => {
    sessionStorage.setItem('token', jwt);
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('gapiToken', gapi)
    setUserState(getCurrUser());
};

export const googleUserRemoveSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('gapiToken')
    setUserState(getCurrUser());
};