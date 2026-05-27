import { useState } from "react";
import emailjs from "@emailjs/browser";
import jsPDF from "jspdf";

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
    const data = Object.fromEntries(formData.entries());
    const handelingenLijst = formData.getAll("handelingen");

if (overigHandeling.trim()) {
  handelingenLijst.push(overigHandeling.trim());
}

const handelingenTekst = handelingenLijst.join(", ");
    const samenvatting = `
Werkbon: ${werkbonnummer}
Opdrachtgever: ${data.opdrachtgever || "-"}
Medewerkers: ${data.medewerker1 || "-"}${data.medewerker2 ? " & " + data.medewerker2 : ""}
Handelingen: ${handelingenTekst || "-"}
Verzonden: ${verzendtijd}
`;
const jaar = new Date().getFullYear();
const uniekNummer = Date.now().toString().slice(-6);
const werkbonnummer = `HB-${jaar}-${uniekNummer}`;
    const verzendtijd = new Date().toLocaleString("nl-NL");
    try {
await emailjs.send(
  "service_cuht529",
  "template_z0ew1qb",
  {
    to_email: "werkbon@houvast-ontzorgen.net",
    werkbonnummer: werkbonnummer,
    verzendtijd: verzendtijd,
    samenvatting: samenvatting,
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
pdf.text("Zuid-Limburg – 24/7 dienstverlening", 20, 37);

pdf.line(20, 43, 190, 43);

pdf.setFontSize(13);
pdf.text(`Werkbonnummer: ${werkbonnummer}`, 20, 53);
pdf.text(`Verzonden: ${verzendtijd}`, 20, 60);
pdf.setFontSize(11);      
pdf.text(`Werkbonnummer: ${werkbonnummer}`, 20, 30);

      let y = 72;

      const addLine = (label, value) => {
        pdf.text(`${label}: ${value || "-"}`, 20, y);
        y += 10;
      };

      addLine("Datum", data.datum);
      addLine("Opdrachtgever", data.opdrachtgever);
      addLine("Medewerker 1", data.medewerker1);
      addLine("Medewerker 2", data.medewerker2);
      addLine("Starttijd", data.starttijd);
      addLine("Eindtijd", data.eindtijd);
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

      const handelingenText = pdf.splitTextToSize(handelingenTekst || "-", 170);
      pdf.text(handelingenText, 20, y);
      y += handelingenText.length * 7 + 15;

      pdf.setFontSize(14);
      pdf.text("Bijzonderheden", 20, y);
      y += 10;
      pdf.setFontSize(11);

      const bijzonderhedenText = pdf.splitTextToSize(
        data.bijzonderheden || "-",
        170
      );
      pdf.text(bijzonderhedenText, 20, y);

const naamVoorBestand =
  data.naamOverledene?.trim() ||
  data.opdrachtgever?.trim() ||
  "onbekend";

const veiligeNaam = naamVoorBestand
  .replaceAll(" ", "_")
  .replace(/[^a-zA-Z0-9_-]/g, "");

const pdfBestandsnaam = `Werkbon_${werkbonnummer}_${data.datum || "zonder-datum"}_${veiligeNaam}.pdf`;

pdf.save(pdfBestandsnaam);

      setStatus("Werkbon succesvol verzonden en PDF opgeslagen.");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus(
        `Fout bij verzenden: ${
          error?.message || error?.text || "onbekende fout"
        }`
      );
    } finally {
      setSending(false);
      setTimeout(() => setStatus(""), 6000);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <h1>Houvast Digitale Werkbon</h1>
        <p style={subStyle}>Mobiele werkbon voor onderweg</p>

        <form onSubmit={handleSubmit}>
          <h2>Opdrachtgegevens</h2>

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
          <select
  name="medewerker2"
  style={inputStyle}
  defaultValue=""
>
  <option value="">
    Kies medewerker 2
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
          <input name="starttijd" type="time" style={inputStyle} />
          <input name="eindtijd" type="time" style={inputStyle} />
          <select
  name="voertuig"
  style={inputStyle}
  defaultValue=""
>
  <option value="">Kies voertuig</option>
  <option value="Ford">Ford</option>
  <option value="Mercedes">Mercedes</option>
  <option value="Renault">Renault</option>
  <option value="Eigen vervoer">Eigen vervoer</option>
</select>

          <h2>Overledene</h2>

          <input name="naamOverledene" placeholder="Naam overledene" style={inputStyle} required />
          <input name="geboortedatum" type="date" style={inputStyle} />
          <input name="adresOverlijden" placeholder="Adres overlijden" style={inputStyle} />
          <input name="overbrengenNaar" placeholder="Overbrengen naar" style={inputStyle} />

          <h2>Werkzaamheden</h2>

          
          <textarea name="bijzonderheden" placeholder="Bijzonderheden" style={textareaStyle} />
<div style={{ marginTop: "20px" }}>
  <label>
    <input type="checkbox" name="handelingen" value="Overbrengen" />
    {" "}Overbrengen
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Verzorgen & kleden" />
    {" "}Verzorgen & kleden
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Inkisten" />
    {" "}Inkisten
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Bedopbaring thuis" />
    {" "}Bedopbaring thuis
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Kistopbaring thuis" />
    {" "}Kistopbaring thuis
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Thuiscontrole" />
    {" "}Thuiscontrole
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Politiemelding" />
    {" "}Politiemelding
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Zorgtaken uitvaartcentrum" />
    {" "}Zorgtaken uitvaartcentrum
  </label>

  <br /><br />

  <label>
    <input type="checkbox" name="handelingen" value="Grafdelving" />
    {" "}Grafdelving
  </label>

  <br /><br />

  <label>
    <input
      type="checkbox"
      checked={overigHandeling !== ""}
      onChange={(e) => {
        if (!e.target.checked) {
          setOverigHandeling("");
        }
      }}
    />
    {" "}Overig
  </label>

  <input
    type="text"
    placeholder="Overige handeling"
    style={inputStyle}
    value={overigHandeling}
    onChange={(e) => setOverigHandeling(e.target.value)}
  />
</div>
          <button type="submit" style={buttonStyle} disabled={sending}>
            {sending ? "BEZIG MET VERZENDEN..." : "VERZEND OPDRACHT NAAR KANTOOR"}
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
