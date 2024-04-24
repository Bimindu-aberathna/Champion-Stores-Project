import { signUpEndpoint } from "../apiCalls"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

// Function to call the signUp API endpoint
export const signUpUser = async (userData) => {
  
    const response = await axios.post(signUpEndpoint, userData);
    return response.status;
 
};
