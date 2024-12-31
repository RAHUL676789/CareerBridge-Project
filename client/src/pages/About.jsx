import React from "react";
import Footer from "../Component/Footer";

const AboutUs = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", lineHeight: "1.6", padding :"0"}}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Welcome to CareerBridge</h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        The platform designed to streamline professional connections and empower user interactions.
      </p>

      <section style={{ marginTop: "20px" }}>
        <h2 style={{ color: "#444" }}>What We Offer</h2>
        <ul style={{ listStyleType: "disc", marginLeft: "20px", color: "#555" }}>
          <li>
            <strong>Seamless Signup & Login:</strong> Users can quickly create an account using their username, email, and profession. We use Passport.js to ensure secure and hassle-free access.
          </li>
          <li>
            <strong>Availability Management:</strong> Users can set and manage their availability for current or future dates, allowing others to know when they are available.
          </li>
          <li>
            <strong>Profile Updates:</strong> Users can update their profiles with the latest information to keep their data accurate and up-to-date.
          </li>
          <li>
            <strong>Real-Time Chat:</strong> Users can communicate with each other through an integrated chat feature, making communication easy and efficient.
          </li>
          <li>
            <strong>Meeting Requests & Scheduling:</strong> Users can send meeting requests, view meeting details, and accept or decline invitations. Meetings can be started during the scheduled time, enabling smooth collaboration.
          </li>
        </ul>
      </section>

      <footer style={{ marginTop: "20px", textAlign: "center", color: "#777", }}>
       
        
            <Footer/>
        
      </footer>
    </div>
  );
};

export default AboutUs;
