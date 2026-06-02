import { useState } from "react";
import emailjs from "@emailjs/browser";
import jsPDF from "jspdf";

const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";

function berekenUren(starttijd, eindtijd) {
  if (!starttijd || !eindtijd) return "";

  const tijdRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!tijdRegex.test(starttijd) || !tijdRegex.test(eindtijd)) {
    return "";
  }

const starttijd = data.starttijdHandmatig || data.starttijd;
const eindtijd = data.eindtijdHandmatig || data.eindtijd;

  let start = startUur * 60 + startMin;
  let eind = eindUur * 60 + eindMin;

  if (eind < start) {
    eind += 24 * 60;
  }

  return ((eind - start) / 60).toFixed(2);
}

export default function App() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [opdrachtgever, setOpdrachtgever] = useState("");
  const [overigHandeling, setOverigHandeling] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setSending(true);
    setStatus("Werkbon wordt verzonden...");

    const form = e.target;
    const formData = new FormData(form);

    const handelingenLijst = formData.getAll("handelingen");

    if (overigHandeling.trim()) {
      handelingenLijst.push(overigHandeling.trim());
    }

    const handelingenTekst = handelingenLijst.join(", ");
    const data = Object.fromEntries(formData.entries());

    const jaar = new Date().getFullYear();
    const uniekNummer = Date.now().toString().slice(-6);
    const werkbonnummer = `HB-${jaar}-${uniekNummer}`;

    const verzendtijd = new Date().toLocaleString("nl-NL");
    const uren = berekenUren(data.starttijd, data.eindtijd);

    const gekozenOpdrachtgever =
      opdrachtgever === "Anders"
        ? data.opdrachtgeverAnders
        : data.opdrachtgever;

    const naamVoorBestand =
      data.naamOverledene?.trim() ||
      gekozenOpdrachtgever?.trim() ||
      "onbekend";

    const veiligeNaam = naamVoorBestand
      .replaceAll(" ", "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");

    const pdfBestandsnaam = `Werkbon_${werkbonnummer}_${
      data.datum || "zonder-datum"
    }_${veiligeNaam}.pdf`;

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          datum: data.datum,
          werkbonnummer: werkbonnummer,
          opdrachtgever: gekozenOpdrachtgever,
          medewerker1: data.medewerker1,
          medewerker2: data.medewerker2,
          starttijd: data.starttijd,
          eindtijd: data.eindtijd,
          uren: uren,
          voertuig: data.voertuig,
          naamOverledene: data.naamOverledene,
          overbrengenNaar: data.overbrengenNaar,
          handelingen: handelingenTekst,
          bijzonderheden: data.bijzonderheden,
        }),
      });

      await emailjs.send(
        "service_cuht529",
        "template_z0ew1qb",
        {
          to_email: "werkbon@houvast-ontzorgen.net",
          werkbonnummer: werkbonnummer,
          verzendtijd: verzendtijd,
          datum: data.datum,
          opdrachtgever: gekozenOpdrachtgever,
          medewerker1: data.medewerker1,
          medewerker2: data.medewerker2,
          starttijd: data.starttijd,
          eindtijd: data.eindtijd,
          uren: uren,
          voertuig: data.voertuig,
          naamOverledene: data.naamOverledene,
          geboortedatum: data.geboortedatum,
          adresOverlijden: data.adresOverlijden,
          overbrengenNaar: data.overbrengenNaar,
          handelingen: handelingenTekst,
          bijzonderheden: data.bijzonderheden,
        },
        "OlX1SMmu3sY3iNpMK"
      );

      const pdf = new jsPDF();

      pdf.setFontSize(22);
      pdf.text("Houvast Digitale Werkbon", 20, 20);

      pdf.setFontSize(11);
      pdf.text("Houvast Postmortale Zorg BV", 20, 30);
      pdf.text("Zuid-Limburg - 24/7 dienstverlening", 20, 37);

      pdf.line(20, 43, 190, 43);

      pdf.setFontSize(13);
      pdf.text(`Werkbonnummer: ${werkbonnummer}`, 20, 53);
      pdf.text(`Verzonden: ${verzendtijd}`, 20, 60);

      pdf.setFontSize(11);

      let y = 72;

      const addLine = (label, value) => {
        pdf.text(`${label}: ${value || "-"}`, 20, y);
        y += 10;
      };

      addLine("Datum", data.datum);
      addLine("Opdrachtgever", gekozenOpdrachtgever);
      addLine("Medewerker 1", data.medewerker1);
      addLine("Medewerker 2", data.medewerker2);
      addLine("Starttijd", data.starttijd);
      addLine("Eindtijd", data.eindtijd);
      addLine("Uren", uren);
      addLine("Voertuig", data.voertuig);

      y += 10;

      pdf.setFontSize(14);
      pdf.text("Overledene", 20, y);

      y += 10;
      pdf.setFontSize(11);

      addLine("Naam", data.naamOverledene);
      addLine("Geboortedatum", data.geboortedatum);
      addLine("Adres overlijden", data.adresOverlijden);
      addLine("Overbrengen naar", data.overbrengenNaar);

      y += 10;

      pdf.setFontSize(14);
      pdf.text("Handelingen", 20, y);

      y += 10;
      pdf.setFontSize(11);

      const handelingenPdf = pdf.splitTextToSize(
        handelingenTekst || "-",
        170
      );

      pdf.text(handelingenPdf, 20, y);

      y += handelingenPdf.length * 7 + 15;

      pdf.setFontSize(14);
      pdf.text("Bijzonderheden", 20, y);

      y += 10;
      pdf.setFontSize(11);

      const bijzonderhedenText = pdf.splitTextToSize(
        data.bijzonderheden || "-",
        170
      );

      pdf.text(bijzonderhedenText, 20, y);

      pdf.save(pdfBestandsnaam);

      setStatus("Werkbon succesvol verzonden, opgeslagen en PDF gemaakt.");

      form.reset();
      setOpdrachtgever("");
      setOverigHandeling("");
    } catch (error) {
      console.error(error);

      setStatus(
        `Fout bij verzenden: ${
          error?.message || error?.text || "onbekende fout"
        }`
      );
    } finally {
      setSending(false);

      setTimeout(() => {
        setStatus("");
      }, 6000);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1>Houvast Digitale Werkbon</h1>

        <p style={subStyle}>Mobiele werkbon voor onderweg</p>

        <form onSubmit={handleSubmit}>
          <h2>Opdrachtgegevens</h2>

          <label style={labelStyle}>Datum opdracht</label>
          <input name="datum" type="date" style={inputStyle} required />

          <select
            name="opdrachtgever"
            style={inputStyle}
            required
            value={opdrachtgever}
            onChange={(e) => setOpdrachtgever(e.target.value)}
          >
            <option value="" disabled>
              Kies opdrachtgever
            </option>
            <option value="Walpot">Walpot</option>
            <option value="Walburgis">Walburgis</option>
            <option value="Sassen Dielemans">Sassen Dielemans</option>
            <option value="Monuta">Monuta</option>
            <option value="Dela">Dela</option>
            <option value="Math Pijls">Math Pijls</option>
            <option value="Anders">Anders...</option>
          </select>

          {opdrachtgever === "Anders" && (
            <input
              name="opdrachtgeverAnders"
              placeholder="Naam opdrachtgever"
              style={inputStyle}
              required
            />
          )}

          <select
            name="medewerker1"
            style={inputStyle}
            required
            defaultValue=""
          >
            <option value="" disabled>
              Kies medewerker 1
            </option>
            <option value="Nicky">Nicky</option>
            <option value="Roland">Roland</option>
            <option value="Cindy">Cindy</option>
            <option value="Cécile">Cécile</option>
            <option value="Mike">Mike</option>
            <option value="Nelleke">Nelleke</option>
            <option value="Dylano">Dylano</option>
            <option value="Gerald">Gerald</option>
            <option value="Marc">Marc</option>
            <option value="Angélique">Angélique</option>
            <option value="Bianca">Bianca</option>
            <option value="Externe/inhuur">Externe/inhuur</option>
          </select>

          <select name="medewerker2" style={inputStyle} defaultValue="">
            <option value="">Kies medewerker 2</option>
            <option value="Nicky">Nicky</option>
            <option value="Roland">Roland</option>
            <option value="Cindy">Cindy</option>
            <option value="Cécile">Cécile</option>
            <option value="Mike">Mike</option>
            <option value="Nelleke">Nelleke</option>
            <option value="Dylano">Dylano</option>
            <option value="Gerald">Gerald</option>
            <option value="Marc">Marc</option>
            <option value="Angélique">Angélique</option>
            <option value="Bianca">Bianca</option>
            <option value="Externe/inhuur">Externe/inhuur</option>
          </select>

<label style={labelStyle}>Starttijd</label>

<input
  name="starttijd"
  type="time"
  style={inputStyle}
/>

<input
  name="starttijdHandmatig"
  type="text"
  placeholder="Werkt tijd kiezen niet? Vul handmatig in, bijv. 08:30"
  style={inputStyle}
/>

<label style={labelStyle}>Eindtijd</label>

<input
  name="eindtijd"
  type="time"
  style={inputStyle}
/>

<input
  name="eindtijdHandmatig"
  type="text"
  placeholder="Werkt tijd kiezen niet? Vul handmatig in, bijv. 10:15"
  style={inputStyle}
/>

          <select name="voertuig" style={inputStyle} defaultValue="">
            <option value="">Kies voertuig</option>
            <option value="Mercedes EQV">Mercedes EQV</option>
            <option value="Ford">Ford</option>
            <option value="Eigen auto">Eigen auto</option>
          </select>

          <h2>Overledene</h2>

          <input
            name="naamOverledene"
            placeholder="Naam overledene"
            style={inputStyle}
            required
          />

          <label style={labelStyle}>Geboortedatum</label>
          <input name="geboortedatum" type="date" style={inputStyle} />

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

          <div style={{ marginTop: "20px" }}>
            {[
              "Overbrengen",
              "Verzorgen & kleden",
              "Inkisten",
              "Bedopbaring thuis",
              "Kistopbaring thuis",
              "Thuiscontrole",
              "Politiemelding",
              "Zorgtaken uitvaartcentrum",
              "Grafdelving",
            ].map((handeling) => (
              <div key={handeling} style={{ marginBottom: "18px" }}>
                <label>
                  <input
                    type="checkbox"
                    name="handelingen"
                    value={handeling}
                  />{" "}
                  {handeling}
                </label>
              </div>
            ))}

            <label>
              <input
                type="checkbox"
                checked={overigHandeling !== ""}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setOverigHandeling("");
                  }
                }}
              />{" "}
              Overig
            </label>

            <input
              type="text"
              placeholder="Overige handeling"
              style={inputStyle}
              value={overigHandeling}
              onChange={(e) => setOverigHandeling(e.target.value)}
            />
          </div>

          <textarea
            name="bijzonderheden"
            placeholder="Bijzonderheden"
            style={textareaStyle}
          />

          <button type="submit" style={buttonStyle} disabled={sending}>
            {sending
              ? "BEZIG MET VERZENDEN..."
              : "VERZEND OPDRACHT NAAR KANTOOR"}
          </button>
        </form>

        {status && <div style={statusStyle}>{status}</div>}

        <p style={footerStyle}>
          Houvast Postmortale Zorg BV - Zuid-Limburg - 24/7 dienstverlening
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

const labelStyle = {
  display: "block",
  marginTop: "16px",
  marginBottom: "4px",
  fontWeight: "bold",
  color: "#333",
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

const helpTextStyle = {
  marginTop: "8px",
  color: "#666",
  fontSize: "14px",
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
