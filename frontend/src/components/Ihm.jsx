import { useState } from "react";
import { api } from '../services/api'


function RenderMd({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H1
    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="md-h1">{line.slice(2)}</h1>);
    }
    // H2
    else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="md-h2">{line.slice(3)}</h2>);
    }
    // H3
    else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="md-h3">{line.slice(4)}</h3>);
    }
    // HR
    else if (line.trim() === "---") {
      elements.push(<hr key={i} className="md-hr" />);
    }
    // Bullet list
    else if (line.match(/^(\s*)[*\-]\s+/)) {
      const depth = line.match(/^(\s*)/)[1].length;
      const content = line.replace(/^(\s*)[*\-]\s+/, "");
      elements.push(
        <li key={i} className={`md-li ${depth > 0 ? "md-li-nested" : ""}`}>
          {renderInline(content)}
        </li>
      );
    }
    // Numbered list
    else if (line.match(/^\d+\.\s+/)) {
      const content = line.replace(/^\d+\.\s+/, "");
      elements.push(
        <li key={i} className="md-li md-li-num">
          {renderInline(content)}
        </li>
      );
    }
    // Empty line
    else if (line.trim() === "") {
      elements.push(<div key={i} className="md-spacer" />);
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} className="md-p">{renderInline(line)}</p>
      );
    }

    i++;
  }

  return <div className="md-body">{elements}</div>;
}

function renderInline(text) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    // Italic *text*
    const sub = part.split(/(\*[^*]+\*)/g);
    return sub.map((s, j) => {
      if (s.startsWith("*") && s.endsWith("*")) {
        return <em key={j}>{s.slice(1, -1)}</em>;
      }
      return s;
    });
  });
}

const EQUIPAMENTOS = [
  { value: "bomba-centrifuga", label: "Bomba Centrífuga KSB MegaCPK" },
  { value: "compressor-parafuso", label: "Compressor Parafuso Atlas Copco GA 55" },
  { value: "motor-eletrico", label: "Motor Elétrico WEG W22" },
  { value: "empilhadeira", label: "Empilhadeira Toyota 8FGCU25" },
  { value: "esteira-transportadora", label: "Esteira Transportadora FlexLink X85" },
];

export default function Ihm() {
  const [prompt, setPrompt] = useState("");
  const [resposta, setResposta] = useState("");
  const [erro, setErro] = useState("");
  const [equipamento, setEquipamento] = useState("bomba-centrifuga");
  const [loading, setLoading] = useState(false);

  async function loadResposta() {
    setErro("");
    setResposta("");

    if (!prompt.trim()) {
      setErro("Descreva o sintoma antes de diagnosticar.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.post("/diagnosticar", {
        equipamento,
        sintomas: prompt,
      });
      setResposta(result.data.resposta);
    } catch (error) {
      console.error(error);
      setErro(
        error.response?.data?.error ||
          "Falha ao conectar com o servidor. Verifique se o backend está rodando."
      );
    } finally {
      setLoading(false);
    }
  }

  function limpar() {
    setPrompt('')
    setResposta('')
  }
  const equipLabel = EQUIPAMENTOS.find((e) => e.value === equipamento)?.label;

  return (
    <>
     

      <div className="ihm-root">
        <div className="ihm-header">
          <div className="ihm-icon">🔧</div>
          <div>
            <div className="ihm-title">IA Diagnóstica</div>
            <div className="ihm-subtitle">
              Diagnóstico de falhas em equipamentos industriais
            </div>
          </div>
        </div>

        <div className="ihm-card">
          <label className="ihm-label" htmlFor="meu-select">Equipamento</label>
          <select
            id="meu-select"
            className="ihm-select"
            value={equipamento}
            onChange={(e) => setEquipamento(e.target.value)}
          >
            {EQUIPAMENTOS.map((eq) => (
              <option key={eq.value} value={eq.value}>{eq.label}</option>
            ))}
          </select>

          <label className="ihm-label" htmlFor="sintoma">Sintoma observado</label>
          <div className="ihm-input-row">
            <input
              id="sintoma"
              type="text"
              className="ihm-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadResposta()}
              placeholder="Descreva os sintomas"
            />
            <button className="ihm-btn" onClick={loadResposta} disabled={loading}>
              {loading ? (
                <>
                  <div className="ihm-spinner" />
                  Analisando…
                </>
              ) : (
                <> Diagnosticar</>
              )}
            </button>
            <button className="ihm-btn" onClick={limpar}>Limpar</button>
          </div>

          {erro && (
            <div className="ihm-error">
              <span>⚠</span> {erro}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="ihm-result">
          <div className="ihm-result-header">
            <div className="ihm-result-dot" style={!resposta ? { background: "#484f58" } : {}} />
            Diagnóstico — {equipLabel}
          </div>
          <div className="ihm-result-body">
            {loading ? (
              <div className="ihm-loading">
                <div className="ihm-spinner" />
                Consultando base de conhecimento técnico…
              </div>
            ) : resposta ? (
              <RenderMd text={resposta} />
            ) : (
              <div className="ihm-empty">
                <div className="ihm-empty-icon">🔍</div>
                Informe um equipamento e descreva o sintoma para iniciar o diagnóstico.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}