import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const socket = io(backendUrl, { transports: ["websocket"] });

export default socket;
