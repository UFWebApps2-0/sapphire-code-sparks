import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./FlagButton.less";
import Flag from "../../assets/flag.png";

export default function FlagButton({ id }) {
  // State for button highlight and message visibility
  const [highlighted, setHighlighted] = useState(false);
  const [message, setMessage] = useState({ words: 0 });

  // Initialize EmailJS
  emailjs.init("SM7VwO6yrGjIp_Z_M");

  // Function to send email
  function sendEmail() {
    emailjs.send("service_15kdnle", "template_b73zh4s", {
      video_id: id,
    });
  }

  // Handle button click
  const handleClick = () => {
    setHighlighted(!highlighted);
    sendEmail();
  };

  // Button component
  return (
    <button
      id="flag-button"
      className={highlighted ? "highlighted" : ""}
      type="button"
      onClick={handleClick}
      disabled={highlighted}
      onMouseEnter={(e) => setMessage({ words: 1 })}
      onMouseLeave={(e) => setMessage({ words: 0 })}
    >
      <img src={Flag} alt="Flag" />
      <div id="message" style={{ opacity: message.words }}>
        Report video
      </div>
    </button>
  );
}