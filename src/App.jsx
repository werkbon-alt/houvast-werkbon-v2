import React, { useState } from "react";
import { jsPDF } from "jspdf";
import emailjs from "@emailjs/browser";

const API_URL = "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";

export default function App() {
  const [data, setData] = useState({
    datum: "",
    werkbonnummer: "",
    opdrachtgever: "",
    medewerker1: "",
    medewerker2: "",
    starttijd: "",
    starttijdHandmatig: "",
    eindtijd: "",
    eindtijdHandmatig: "",
    uren: "",
    voertuig: "",
    naamOverledene: "",
    overbrengenNaar: "",
    handelingen: "",
    bijzonderheden: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Versturen...");

    try {
      // Verzenden naar Google Sheets
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // PDF genereren
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Werkbon Houvast Postmortale Zorg", 20, 20);
      Object.entries(data).forEach(([key, value], i) => {
        doc.text(`${key}: ${value}`, 20, 30 + i * 8);
      });
      doc.save(`${data.werkbonnummer || "werkbon"}.pdf`);

      // Mailen via EmailJS
      await emailjs.send(
        "service_cuht529",
        "template_z0ew1qb",
        data,
        "OlX1SMmu3sY3iNpMK"
      );

      setStatus("Werkbon succesvol verzonden!");
      setData({
        datum: "",
        werkbonnummer: "",
        opdrachtgever: "",
        medewerker1: "",
        medewerker2: "",
        starttijd: "",
        starttijdHandmatig: "",
        eindtijd: "",
        eindtijdHandmatig: "",
        uren: "",
        voertuig: "",
        naamOverledene: "",
        overbrengenNaar: "",
        handelingen: "",
        bijzonderheden: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("Er is iets fout gegaan.");
    }
  }

  return (
    <main style={{ fontFamily: "Arial", maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h1>Digitale Werkbon Houvast</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <label>Datum
          <input type="text" name="datum" value={data.datum} onChange={handleChange} placeholder="DD-MM-YYYY" required />
        </label>

        <label>Werkbonnummer
          <input type="text" name="werkbonnummer" value={data.werkbonnummer} onChange={handleChange} required />
        </label>

        <label>Opdrachtgever
          <select name="opdrachtgever" value={data.opdrachtgever} onChange={handleChange} required>
            <option value="">Selecteer opdrachtgever</option>
            <option value="Walpot">Walpot</option>
            <option value="Walburgis">Walburgis</option>
            <option value="Sassen Dielemans">Sassen Dielemans</option>
            <option value="Monuta">Monuta</option>
            <option value="Dela">Dela</option>
            <option value="Math Pijls">Math Pijls</option>
            <option value="Anders">Anders</option>
          </select>
        </label>

        <label>Medewerker 1
          <select name="medewerker1" value={data.medewerker1} onChange={handleChange} required>
            <option value="">Selecteer medewerker</option>
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
        </label>

        <label>Medewerker 2
          <select name="medewerker2" value={data.medewerker2} onChange={handleChange}>
            <option value="">Selecteer medewerker</option>
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
        </label>

        <label>Starttijd
          <input type="time" name="starttijd" value={data.starttijd} onChange={handleChange} />
          <input type="text" name="starttijdHandmatig" value={data.starttijdHandmatig} onChange={handleChange} placeholder="Voor Android" />
        </label>

        <label>Eindtijd
          <input type="time" name="eindtijd" value={data.eindtijd} onChange={handleChange} />
          <input type="text" name="eindtijdHandmatig" value={data.eindtijdHandmatig} onChange={handleChange} placeholder="Voor Android" />
        </label>

        <label>Uren
          <input type="number" step="1" name="uren" value={data.uren} onChange={handleChange} required />
        </label>

        <label>Voertuig
          <select name="voertuig" value={data.voertuig} onChange={handleChange} required>
            <option value="">Selecteer voertuig</option>
            <option value="Mercedes EQV">Mercedes EQV</option>
            <option value="Ford">Ford</option>
            <option value="Eigen auto">Eigen auto</option>
          </select>
        </label>

        <label>Naam overledene
          <input type="text" name="naamOverledene" value={data.naamOverledene} onChange={handleChange} />
        </label>

        <label>Overbrengen naar
          <input type="text" name="overbrengenNaar" value={data.overbrengenNaar} onChange={handleChange} />
        </label>

        <label>Handelingen
          <input type="text" name="handelingen" value={data.handelingen} onChange={handleChange} placeholder="Meerdere, gescheiden door komma" />
        </label>

        <label>Bijzonderheden
          <textarea name="bijzonderheden" value={data.bijzonderheden} onChange={handleChange} />
        </label>

        <button type="submit" style={{ padding: "12px 20px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold" }}>
          Werkbon versturen
        </button>
      </form>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>{status}</p>
    </main>
  );
}
