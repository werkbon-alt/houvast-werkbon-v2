export default function App() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>Houvast Werkbon V2 🚀</h1>

      <div style={{ marginTop: "30px" }}>
        <h2>Opdrachtgegevens</h2>

        <input placeholder="Datum opdracht" style={inputStyle} />
        <input placeholder="Opdrachtgever" style={inputStyle} />
        <input placeholder="Medewerker 1" style={inputStyle} />
        <input placeholder="Medewerker 2" style={inputStyle} />
        <input placeholder="Starttijd" style={inputStyle} />
        <input placeholder="Eindtijd" style={inputStyle} />
        <input placeholder="Voertuig" style={inputStyle} />
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Overledene</h2>

        <input placeholder="Naam overledene" style={inputStyle} />
        <input placeholder="Geboortedatum" style={inputStyle} />
        <input placeholder="Adres overlijden" style={inputStyle} />
        <input placeholder="Overbrengen naar" style={inputStyle} />
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Werkzaamheden</h2>

        <textarea
          placeholder="Handelingen"
          style={textareaStyle}
        />

        <textarea
          placeholder="Bijzonderheden"
          style={textareaStyle}
        />
      </div>

      <button style={buttonStyle}>
        VERZEND OPDRACHT NAAR KANTOOR
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "10px",
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
  marginTop: "40px",
  borderRadius: "12px",
  border: "none",
  background: "black",
  color: "white",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};
