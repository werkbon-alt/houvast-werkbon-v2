import { useState } from "react";
import emailjs from "@emailjs/browser";
import jsPDF from "jspdf";

export default function App() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setSending(true);
    setStatus("Werkbon wordt verzonden...");

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // EERST MAIL VERSTUREN
      await emailjs.send(
        "service_cuht529",
        "template_z0ew1qb",
        {
          to_email: "werkbon@houvast-ontzorgen.net",
          datum: data.datum,
          opdrachtgever: data.opdrachtgever,
          medewerker1: data.medewerker1,
          medewerker2: data.medewerker2,
          starttijd: data.starttijd,
          eindtijd: data.eindtijd,
          voertuig: data.voertuig,
          naamOverledene: data.naamOverledene,
          geboortedatum: data.geboortedatum,
          adresOverlijden: data.adresOverlijden,
          overbrengenNaar: data.overbrengenNaar,
          handelingen: data.handelingen,
          bijzonderheden: data.bijzonderheden,
        },
        "OlX1SMmu3sY3iNpMK"
      );

      // DAARNA PDF MAKEN
      const pdf = new jsPDF();

      pdf.setFontSize(18);
      pdf.text("Houvast Werkbon", 20, 20);

      pdf.setFontSize(11);

      pdf.text(`Datum: ${data.datum || "-"}`, 20, 35);
      pdf.text(`Opdrachtgever: ${data.opdrachtgever || "-"}`, 20, 45);
      pdf.text(`Medewerker 1: ${data.medewerker1 || "-"}`, 20, 55);
      pdf.text(`Medewerker 2: ${data.medewerker2 || "-"}`, 20, 65);
      pdf.text(`Starttijd: ${data.starttijd || "-"}`, 20, 75);
      pdf.text(`Eindtijd: ${data.eindtijd || "-"}`, 20, 85);
      pdf.text(`Voertuig: ${data.voertuig || "-"}`, 20, 95);

      pdf.text("Overledene", 20, 115);

      pdf.text(`Naam: ${data.naamOverledene || "-"}`, 20, 125);
      pdf.text(`Geboortedatum: ${data.geboortedatum || "-"}`, 20, 135);
      pdf.text(`Adres overlijden: ${data.adresOverlijden || "-"}`, 20, 145);
      pdf.text(`Overbrengen naar: ${data.overbrengenNaar || "-"}`, 20, 155);

      pdf.text("Handelingen:", 20, 175);

      pdf.text(
        pdf.splitTextToSize(data.handelingen || "-", 170),
        20,
        185
      );

      pdf.text("Bijzonderheden:", 20, 225);

      pdf.text(
        pdf.splitTextToSize(data.bijzonderheden || "-", 170),
        20,
        235
      );



      // STATUS
      setStatus("Werkbon succesvol verzonden en PDF gemaakt.");

      // FORM RESET
      form.reset();

    } catch (error) {
      console.error(error);
      setStatus("Fout bij verzenden. Probeer opnieuw.");
    } finally {
      setSending(false);

      setTimeout(() => {
        setStatus("");
      }, 4000);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1>Houvast Digitale Werkbon</h1>

        <p style={subStyle}>
          Mobiele werkbon voor onderweg
        </p>

        <form onSubmit={handleSubmit}>
          <h2>Opdrachtgegevens</h2>

          <input
            name="datum"
            type="date"
            style={inputStyle}
            required
          />

          <input
            name="opdrachtgever"
            placeholder="Opdrachtgever"
            style={inputStyle}
            required
          />

          <input
            name="medewerker1"
            placeholder="Medewerker 1"
            style={inputStyle}
            required
          />

          <input
            name="medewerker2"
            placeholder="Medewerker 2"
            style={inputStyle}
          />

          <input
            name="starttijd"
            type="time"
            style={inputStyle}
          />

          <input
            name="eindtijd"
            type="time"
            style={inputStyle}
          />

          <input
            name="voertuig"
            placeholder="Voertuig"
            style={inputStyle}
          />

          <h2>Overledene</h2>

          <input
            name="naamOverledene"
            placeholder="Naam overledene"
            style={inputStyle}
            required
          />

          <input
            name="geboortedatum"
            type="date"
            style={inputStyle}
          />

          <input
            name="adresOverlijden"
            placeholder="Adres overlijden"
            style={inputStyle}
          />

          <input
            name="overbrengenNaar"
            placeholder="Overbrengen naar"
            style={inputStyle}
          />

          <h2>Werkzaamheden</h2>

          <textarea
            name="handelingen"
            placeholder="Handelingen"
            style={textareaStyle}
          />

          <textarea
            name="bijzonderheden"
            placeholder="Bijzonderheden"
            style={textareaStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={sending}
          >
            {sending
              ? "BEZIG MET VERZENDEN..."
              : "VERZEND OPDRACHT NAAR KANTOOR"}
          </button>
        </form>

        {status && (
          <div style={statusStyle}>
            {status}
          </div>
        )}

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
