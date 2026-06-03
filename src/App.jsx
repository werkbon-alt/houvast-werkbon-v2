import React, { useState } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzgTXIHhPWgCCDCYOiWfywCYT0mU6Ix-XC9y9qd1s7RunEKIwh45ZFEKRFged2ZMOZ2/exec";

export default function App() {
  const [data, setData] = useState({
    datum: "",
    werkbonnummer: "",
    opdrachtgever: "",
    medewerker1: "",
    medewerker2: "",
    starttijd: "",
    eindtijd: "",
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
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await resp.json();

      if (result.success) {
        setStatus("Werkbon succesvol verzonden!");
        // reset form
        setData({
          datum: "",
          werkbonnummer: "",
          opdrachtgever: "",
          medewerker1: "",
          medewerker2: "",
          starttijd: "",
          eindtijd: "",
          uren: "",
          voertuig: "",
          naamOverledene: "",
          overbrengenNaar: "",
          handelingen: "",
          bijzonderheden: "",
        });
      } else {
        setStatus("Er is iets fout gegaan.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Er is iets fout gegaan.");
    }
  }

  return (
    <main style={{ fontFamily: "Arial", padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Digitale Werkbon Houvast</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <label>Datum
          <input type="date" name="datum" value={data.datum} onChange={handleChange} required />
        </label>

        <label>Werkbonnummer
          <input type="text" name="werkbonnummer" value={data.werkbonnummer} onChange={handleChange} required />
        </label>

        <label>Opdrachtgever
          <input type="text" name="opdrachtgever" value={data.opdrachtgever} onChange={handleChange} required />
        </label>

        <label>Medewerker 1
          <input type="text" name="medewerker1" value={data.medewerker1} onChange={handleChange} required />
        </label>

        <label>Medewerker 2
          <input type="text" name="medewerker2" value={data.medewerker2} onChange={handleChange} />
        </label>

        <label>Starttijd
          <input type="time" name="starttijd" value={data.starttijd} onChange={handleChange} required />
        </label>

        <label>Eindtijd
          <input type="time" name="eindtijd" value={data.eindtijd} onChange={handleChange} required />
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
          <input type="text" name="handelingen" value={data.handelingen} onChange={handleChange} placeholder="Meerdere handelingen, gescheiden door komma" />
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
