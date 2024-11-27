// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import '../styles/Login1.css';
// import email_icon from '../components/assets/person.png'
// import password_icon from '../components/assets/password.png'

// function Login1() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Function to handle login success
//   const handleLoginSuccess = () => {
//     console.log("Login success. Setting isAuthenticated to true.");
//     setIsAuthenticated(true);
//     if (!isAuthenticated) {
//         console.log("hi");
//         //navigate("/analysis"); // Navigate to /analysis upon successful logi
//         return <p>You need to log in to view this page.</p>;
//       }
//     //navigate("/analysis"); // Navigate to /analysis upon successful login
//   };

//   async function submit(e) {
//     e.preventDefault();
//     console.log("Attempting login...");
//     try {
//       const res = await axios.post("http://localhost:5000/adminlogin", {
//         username,
//         password,
//       });
//       console.log("Response from server:", res.data);
//       if (res.status === 200) {
//         const { message, redirectTo } = res.data;
//         alert(message); // Show a message, like "Welcome, Admin!"
//         // Navigate based on the user's role
//         if (redirectTo) {
//           navigate(redirectTo,{state:{username}});
//         }
//         else {
//           console.log("Unexpected role or missing redirect path.");
//         }
//       }else {
//         // Handle other unexpected status codes
//         alert("Unexpected response from server.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert("An error occurred while logging in. Please check the console for details.");
//     }
//   }
//   return (
//     <div className="background">
//       <div className="login">
//         <div className="header">
//           <h1>Login</h1>
//           <div className="underline"></div>
//         </div>
//         <form onSubmit={submit}>
//           <div className="inputs">
//             <div className="input">
//               <img src={email_icon} alt="Email Icon"/>
//               <input
//                  type="username"
//                  onChange={(e) => setUsername(e.target.value)}
//                  placeholder="Username"
//               />
//             </div>
//             <div className="input">
//               <img src={password_icon} alt="Password Icon"/>
//               <input
//                  type="password"
//                  onChange={(e) => setPassword(e.target.value)}
//                  placeholder="Password"
//               />
//             </div>
//             <div className="submit-container">
//                <input className="submit" type="submit" value="Login" />
//             </div> 
//       </div>
//     </form>
//     </div>
//   </div>
//   );
// }

// export default Login1;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login1.css";
import email_icon from "../components/assets/person.png";
import password_icon from "../components/assets/password.png";

function Login1() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();
    console.log("Attempting login...");
    try {
      const res = await axios.post("http://localhost:5000/adminlogin", {
        username,
        password,
      });

      console.log("Response from server:", res.data);

      if (res.status === 200) {
        const { message, redirectTo, role } = res.data; // Extract role
        alert(message); // Show the login message
        
        // Navigate to the analysis page with username and role
        if (redirectTo) {
          navigate(redirectTo, { state: { username, role } });
        } else {
          console.log("Unexpected role or missing redirect path.");
        }
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please check the console for details.");
    }
  }

  return (
    <div className="background">
      <div className="login">
        <div className="header">
          <h1>Login</h1>
          <div className="underline"></div>
        </div>
        <form onSubmit={submit}>
          <div className="inputs">
            <div className="input">
              <img src={email_icon} alt="Email Icon" />
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="input">
              <img src={password_icon} alt="Password Icon" />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="submit-container">
              <input className="submit" type="submit" value="Login" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login1;
