import React from "react";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <div style={{ textAlign: "center", marginTop: 40 }}>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    );
}