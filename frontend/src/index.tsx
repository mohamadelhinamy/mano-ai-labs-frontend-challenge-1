import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';

createRoot(document.getElementById("root")).render(<App />);
