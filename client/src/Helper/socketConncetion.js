import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocketConnection } from "../feature/users/CurrentUser";

const URL = import.meta.env.VITE_BACKEND_URL;

export const useSocketConnect = () => {
 

  const socketConnect = () => {
    try {
        const dispatch = useDispatch();
        const currentUser = useSelector((state) => state.currentUser);
        const userId = localStorage.getItem("id");
      const socket = io(URL, {
        auth: {
          userId: userId// Pass auth object properly
        },
      });

      socket.on("connection-success", (data) => {
        console.log("Connected successfully:", data.message);
        console.log("Socket ID:", data.socketId);
      });

      dispatch(setSocketConnection(socket)); // Save the socket in Redux
    } catch (e) {
      console.error(
        "An error occurred while connecting the socket:",
        e.message
      );
    }
  };

  return  { socketConnect };
};
