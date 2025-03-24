import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to get the email of the owner
const getEmail = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "get",
            url: "http://localhost:5000/api/owner/accountServices/getEmail",
            headers: { "x-access-token": accessToken },
        });
        return res.data.email;
    } catch (err) {
        console.log(err);
        toast.error("Error fetching email", {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

// Function to change the email of the owner
const ChangeEmail = async (email) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/changeEmail",
            headers: { "x-access-token": accessToken },
            data: { email },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error("Error changing email", {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

// Function to verify the password of the owner
const verifyPassword = async (password) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/verifyPassword",
            headers: { "x-access-token": accessToken },
            data: { password },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

// Function to change the password of the owner
const changePassword = async (password) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/changePassword",
            headers: { "x-access-token": accessToken },
            data: { password },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};


// Function to check the email of the owner
const checkEmail = async(email) => {
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/checkEmail",
            data: { email },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 2500,
        }); 
        throw err;
    }
};

// Function to send the OTP to the owner
const sendUserOTP = async(email,OTP) => {
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/sendOTP",
            data: { email,OTP },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 2500,
        }); 
        throw err;
    }
};

// Function to reset the password of the owner
const resetPassword = async(email,password,OTP) => {
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/resetPassword",
            data: { email,password,OTP },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 2500,
        }); 
        throw err;
    }
};

export { getEmail, ChangeEmail, verifyPassword, changePassword, checkEmail, sendUserOTP, resetPassword};