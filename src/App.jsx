import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("Werkbon succesvol verwerkt.");
    e.target.reset();

    setTimeout(() => setStatus(""), 3000);
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1>Houvast Digitale Werkbon</h1>
        <p style={subStyle}>Mobiele werkbon voor onderweg</p>

        <form onSubmit={handleSubmit}>
          <h2>Opdrachtgegevens</h2>

          <input name="datum" type="date" style={inputStyle} required />
          <input name="opdrachtgever" placeholder="Opdrachtgever" style={inputStyle} required />
          <input name="medewerker1" placeholder="Medewerker 1" style={inputStyle} required />
          <input name="medewerker2" placeholder="Medewerker 2" style={inputStyle} />
          <input name="starttijd" type="time" style={inputStyle} />
          <input name="eindtijd" type="time" style={inputStyle} />
          <input name="voertuig" placeholder="Voertuig" style={inputStyle} />

          <h2>Overledene</h2>

          <input name="naamOverledene" placeholder="Naam overledene" style={inputStyle} required />
          <input name="geboortedatum" type="date" style={inputStyle} />
          <input name="adresOverlijden" placeholder="Adres overlijden" style={inputStyle} />
          <input name="overbrengenNaar" placeholder="Overbrengen naar" style={inputStyle} />

          <h2>Werkzaamheden</h2>

          <textarea name="handelingen" placeholder="Handelingen" style={textareaStyle} />
          <textarea name="bijzonderheden" placeholder="Bijzonderheden" style={textareaStyle} />

          <button type="submit" style={buttonStyle}>
            VERZEND OPDRACHT NAAR KANTOOR
          </button>
        </form>

        {status && <div style={statusStyle}>{status}</div>}

        <p style={footerStyle}>
          Houvast Postmortale Zorg BV – Zuid-Limburg – 24/7 dienstverlening
        </p>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#f2f2f2",
  padding: "16px",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  maxWidth: "720px",
  margin: "0 auto",
  background: "#fff",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const subStyle = {
  color: "#666",
  marginBottom: "30px",
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "12px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
};

const buttonStyle = {
  width: "100%",
  padding: "20px",
  marginTop: "30px",
  borderRadius: "14px",
  border: "none",
  background: "#000",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const statusStyle = {
  marginTop: "20px",
  padding: "16px",
  borderRadius: "12px",
  background: "#d1fae5",
  color: "#065f46",
  textAlign: "center",
  fontWeight: "bold",
};

const footerStyle = {
  marginTop: "24px",
  textAlign: "center",
  color: "#777",
  fontSize: "13px",
};
