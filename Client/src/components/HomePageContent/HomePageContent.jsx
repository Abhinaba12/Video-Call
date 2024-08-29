import "./homePageContent.css"
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePageContent = () => {
    const { user } = useContext(AuthContext);
    const [roomID, setRoomID] = useState("");
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        setRoomID(e.target.value);
    };
    const handleClick = () => {
        if (roomID == "") {
            toast.error("Please Enter Room ID!", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
        else {
            if (!user) {
                navigate("/login");
            }
            else {
                navigate(`/room/${roomID}`);
            }
        }
    }

    return (
        <div className="home-page-content">
            <h1>Connect Instantly, <br></br> Chat Seamlessly.</h1>
            <p>Experience the Power of Peer-to-Peer <br></br> Communication with our Secure and User-Friendly <br></br>Chat App.
                Create or Join a Room Using Room ID</p>
            <input className="roomID" type="text" placeholder="Enter Room Id" onChange={handleInputChange} value={roomID} name="roomID" />
            <br></br>
            <button className="joinBtn" onClick={handleClick}>Join Room</button>
            <ToastContainer />
        </div>

    );
};
export default HomePageContent;