import React from "react";

const CookiesPolicy: React.FC = () => {
  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1>Cookies Policy</h1>

      <section>
        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small files stored on your device to improve your
          experience.
        </p>
      </section>

      <section>
        <h2>2. How We Use Cookies</h2>
        <p>
          We use cookies to remember your preferences and analyze site traffic.
        </p>
      </section>

      <section>
        <h2>3. Managing Cookies</h2>
        <p>You can control or disable cookies via your browser settings.</p>
      </section>
    </main>
  );
};

export default CookiesPolicy;
