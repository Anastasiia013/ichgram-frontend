import React from "react";

const TermsOfService: React.FC = () => {
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
      <h1>Terms of Service</h1>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By using our service, you agree to these Terms of Service. Please read
          them carefully.
        </p>
      </section>

      <section>
        <h2>2. User Responsibilities</h2>
        <p>
          You agree not to misuse the service or interfere with other users'
          experience.
        </p>
      </section>

      <section>
        <h2>3. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use means
          acceptance of changes.
        </p>
      </section>
    </main>
  );
};

export default TermsOfService;
