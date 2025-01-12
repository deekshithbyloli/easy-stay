import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
});
export const registerUser = async (data) => {
  const response = await axiosInstance.post('register', data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await axiosInstance.post('register/verify-otp', data);
  return response.data;
};
