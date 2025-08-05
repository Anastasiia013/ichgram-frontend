import React from "react";

const PrivacyPolicy: React.FC = () => {
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
      <h1>Privacy Policy</h1>

      <section>
        <h2>1. Information We Collect</h2>
        <p>
          We collect personal data you provide when you register or use the
          service.
        </p>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>
          Your data is used to provide and improve the service, and to
          communicate with you.
        </p>
      </section>

      <section>
        <h2>3. Data Security</h2>
        <p>
          We take reasonable measures to protect your data from unauthorized
          access.
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
