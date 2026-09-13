# IA Diagnóstica Industrial

Sistema de Inteligência Artificial desenvolvido para auxiliar no diagnóstico de falhas em equipamentos industriais.

A aplicação permite selecionar um equipamento, informar um sintoma observado e receber uma análise gerada por Inteligência Artificial. O sistema foi desenvolvido com uma arquitetura separada entre frontend e backend, permitindo uma comunicação por meio de uma API HTTP.

## Função do Projeto

O objetivo do projeto é utilizar Inteligência Artificial como ferramenta de apoio ao diagnóstico e à manutenção de equipamentos industriais.

O usuário seleciona o equipamento que deseja analisar e descreve o sintoma observado. Essas informações são enviadas ao backend, que constrói uma solicitação técnica e a encaminha para o modelo de Inteligência Artificial do Google Gemini.

Atualmente, o sistema possui suporte aos seguintes equipamentos:

* Bomba Centrífuga KSB MegaCPK
* Compressor Parafuso Atlas Copco GA 55
* Motor Elétrico WEG W22
* Empilhadeira Toyota 8FGCU25
* Esteira Transportadora FlexLink X85

## Funcionamento

O funcionamento da aplicação ocorre da seguinte maneira:

```text
Usuário
   |
   v
Frontend React
   |
   | Axios / HTTP
   v
Backend Node.js + Express
   |
   | Google Gemini API
   v
Inteligência Artificial
   |
   v
Análise do equipamento
   |
   v
Backend
   |
   | JSON
   v
Frontend
   |
   v
Resultado do diagnóstico
```

O usuário seleciona um equipamento e descreve o sintoma apresentado.

O frontend envia uma requisição `POST` para:

```text
http://localhost:3000/diagnosticar
```

O backend recebe o equipamento e os sintomas e monta um prompt orientando a Inteligência Artificial a atuar como um Engenheiro de Manutenção Sênior Industrial.

A IA é instruída a considerar:

* Segurança em primeiro lugar;
* Procedimentos LOTO quando necessários;
* Diagnóstico visual antes de intervenções;
* Hipóteses organizadas por probabilidade;
* Evitar invenções técnicas.

Depois da análise, o resultado é devolvido ao frontend e apresentado ao usuário.

## Tecnologias Utilizadas

### Frontend

O frontend foi desenvolvido utilizando:

* **React 19** — construção da interface e gerenciamento dos componentes;
* **Vite 8** — servidor de desenvolvimento e ferramenta de build;
* **JavaScript (JSX)** — linguagem utilizada no desenvolvimento do frontend;
* **Axios** — comunicação HTTP entre frontend e backend;
* **CSS** — estilização da interface;
* **ESLint** — análise e padronização do código JavaScript/React.

### Backend

O backend foi desenvolvido utilizando:

* **Node.js** — ambiente de execução JavaScript;
* **Express 5** — criação do servidor e das rotas da API;
* **JavaScript com ES Modules** — organização dos módulos do backend;
* **CORS** — permite a comunicação entre frontend e backend;
* **dotenv** — carregamento de variáveis de ambiente.

### Inteligência Artificial

A aplicação utiliza a **Google Gemini API**, através do pacote:

```text
@google/genai
```

São utilizados dois modelos no backend:

```text
gemini-3.1-flash-lite
```

utilizado pela rota `/perguntar`, e:

```text
gemini-2.5-flash
```

utilizado especificamente para o diagnóstico industrial através da rota `/diagnosticar`.

## Arquitetura

O projeto possui duas aplicações independentes:

```text
IA-diagnostica-main/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── components/
        │   └── Ihm.jsx
        └── services/
            └── api.js
```

## API

### POST `/diagnosticar`

Responsável pelo diagnóstico industrial.

Entrada:

```json
{
  "equipamento": "bomba-centrifuga",
  "sintomas": "A bomba está apresentando vibração excessiva."
}
```

O backend utiliza essas informações para construir o prompt enviado ao Gemini.

Resposta:

```json
{
  "sucesso": true,
  "resposta": "..."
}
```

### POST `/perguntar`

Também existe uma rota genérica para enviar uma pergunta diretamente para o modelo de Inteligência Artificial.

Entrada:

```json
{
  "prompt": "..."
}
```

Resposta:

```json
{
  "sucesso": true,
  "resposta": "..."
}
```

## Requisitos

Para executar o projeto, é necessário ter instalado:

* Node.js
* npm
* Uma chave de API do Google Gemini

## Configuração da API do Gemini

O backend utiliza uma variável de ambiente chamada:

```text
GEMINI_API_KEY
```

Dentro da pasta `backend`, crie um arquivo:

```text
.env
```

Com:

```env
GEMINI_API_KEY=SUA_CHAVE_DA_API
```

A chave não deve ser inserida diretamente no código-fonte nem enviada para o repositório.

## Inicialização do Backend

Abra um terminal na pasta do projeto e entre no backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Depois, inicie o servidor:

```bash
npm start
```

O servidor será iniciado na porta `3000`.

A mensagem apresentada será:

```text
Servidor rodando em http://localhost:3000
```

O backend possui a seguinte configuração de porta:

```javascript
const port = process.env.PORT || 3000;
```

Portanto, caso a variável `PORT` não seja definida, a aplicação utilizará a porta `3000`.

## Inicialização do Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Depois execute:

```bash
npm run dev
```

O Vite iniciará o servidor de desenvolvimento e fornecerá o endereço local para acessar a aplicação.

O frontend está configurado para utilizar o backend em:

```text
http://localhost:3000
```

Essa configuração está localizada em:

```text
frontend/src/services/api.js
```

## Inicialização Completa

Para executar o projeto completo, é necessário manter **dois processos em execução**.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Depois, acesse o endereço fornecido pelo Vite no navegador.

## Compilação do Frontend

O frontend pode ser compilado para uma versão de produção utilizando o Vite.

Dentro da pasta `frontend`, execute:

```bash
npm run build
```

O Vite irá gerar a versão de produção na pasta:

```text
frontend/dist/
```

Para visualizar essa versão utilizando o servidor de preview do Vite:

```bash
npm run preview
```

## Backend em Produção

O backend não possui uma etapa de compilação equivalente ao frontend. Ele é executado diretamente pelo Node.js através do arquivo:

```text
backend/server.js
```

O comando definido no `package.json` é:

```bash
npm start
```

que executa:

```bash
node server.js
```

## Resultado

O resultado do sistema é uma análise técnica gerada por Inteligência Artificial a partir do equipamento selecionado e dos sintomas informados pelo usuário.

A resposta é apresentada diretamente na interface da aplicação, permitindo que o usuário visualize as informações produzidas pelo diagnóstico.

O sistema busca estruturar a análise considerando princípios de manutenção industrial, incluindo segurança, inspeção visual, levantamento de hipóteses e identificação de possíveis causas.

## Exemplo de Utilização

O usuário pode selecionar:

```text
Motor Elétrico WEG W22
```

E informar:

```text
O motor está apresentando vibração e aquecimento excessivo.
```

A aplicação envia essas informações para o backend.

O backend transforma os dados em uma solicitação direcionada ao Gemini e recebe uma análise técnica.

O resultado é então retornado para a interface e apresentado ao usuário.

## Interface

A interface foi desenvolvida especificamente para o diagnóstico industrial.

Ela apresenta:

* Seleção do equipamento;
* Campo para descrição do sintoma;
* Botão para iniciar o diagnóstico;
* Indicador de carregamento durante a análise;
* Área para apresentação do resultado;
* Mensagens de erro em caso de falha na comunicação;
* Botão para limpar os dados.

A aplicação também possui um componente próprio para interpretar parte da formatação Markdown retornada pela Inteligência Artificial, permitindo apresentar títulos, listas, textos em negrito e outros elementos de forma estruturada.

## Objetivo Técnico

O projeto demonstra a integração entre desenvolvimento web e Inteligência Artificial aplicada à manutenção industrial.

A arquitetura utilizada permite separar a interface da lógica responsável pela comunicação com a IA:

```text
React
  |
  v
Axios
  |
  v
API Express
  |
  v
Google Gemini
  |
  v
Diagnóstico
```

Essa estrutura também permite que o frontend seja modificado ou substituído sem que seja necessário alterar a lógica principal de comunicação com a Inteligência Artificial.

## Considerações

O projeto apresenta uma aplicação de Inteligência Artificial voltada para diagnóstico e análise de equipamentos industriais.

A solução pode ser expandida futuramente com funcionalidades como:

* Cadastro de equipamentos;
* Histórico de diagnósticos;
* Banco de dados para armazenamento das análises;
* Integração com sensores industriais;
* Análise de imagens de peças;
* Monitoramento em tempo real;
* Sistemas de manutenção preventiva;
* Integração com sistemas industriais e IoT.

## Autor

**Gustavo Camargo**
