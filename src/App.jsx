import React, { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setData({
      datum: params.get("datum"),
      opdrachtgever: params.get("opdrachtgever"),
      medewerker1: params.get("medewerker1"),
      medewerker2: params.get("medewerker2"),
      planningId: params.get("planningId")
    });
  }, []);

  const handleSubmit = () => {
    fetch("YOUR_APPS_SCRIPT_WEB_APP_URL", {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(() => {
        alert("Werkbon verzonden!");
        if (window.opener) {
          window.opener.postMessage(`werkbon-gestart-${data.planningId}`, "*");
        }
      });
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Werkbon</h1>
      <p>Datum: <input value={data.datum || ""} readOnly /></p>
      <p>Opdrachtgever: <input value={data.opdrachtgever || ""} readOnly /></p>
      <p>Medewerker 1: <input value={data.medewerker1 || ""} readOnly /></p>
      <p>Medewerker 2: <input value={data.medewerker2 || ""} readOnly /></p>
      <button onClick={handleSubmit} style={{ background: "#16a34a", color: "#fff" }}>
        Verzenden
      </button>
    </main>
  );
}
