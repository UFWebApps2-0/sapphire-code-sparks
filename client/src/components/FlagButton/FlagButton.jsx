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
  function sendEmail(reason) {
    emailjs.send("service_9y45peo", "template_b73zh4s", {
      video_id: id,
      reason: reason,
      page_link: window.location.href,
    });
  }

  // Handle button click
  const handleClick = () => {
    const reason = window.prompt("Please enter a reason for reporting this video:");
    console.log(reason);
    if (reason) {
      setHighlighted(!highlighted);
      sendEmail(reason);
    }
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