import { useState, useEffect } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { google } from "googleapis";

function PlanilhaGoogle() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function getDadosPlanilha() {
      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const doc = new GoogleSpreadsheet("ID_DA_SUA_PLANILHA");

      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
      });

      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();

      setDados(rows);
    }

    getDadosPlanilha();
  }, []);

  return (
    <div>
      <h1>Dados da planilha:</h1>
      {dados.map((row, index) => (
        <div key={index}>
          <span>{row.nome}</span>
          <span>{row.email}</span>
          <span>{row.telefone}</span>
        </div>
      ))}
    </div>
  );
}

export default PlanilhaGoogle;
