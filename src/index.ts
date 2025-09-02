import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" }); // agora alinhado ao seu ambiente
const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";
const PROMPT = "Olá, quem é você?";

async function runAgent() {
  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 256,
    messages: [
      { role: "user", content: [{ type: "text", text: PROMPT }] }
    ]
  };

  const res = await client.send(new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  }));

  const json = JSON.parse(new TextDecoder().decode(res.body));
  console.log("Resposta do modelo:", json);
}

runAgent().catch((err) => {
  console.error("Erro ao invocar o modelo:", err);
  if (err.name === "AccessDeniedException") {
    console.log("\nSoluções possíveis:");
    console.log("1) Habilitar o modelo Anthropic escolhido na região us-east-1");
    console.log("2) Conferir se não há SCP/Boundary negando bedrock:InvokeModel");
    console.log("3) Se o modelo não existir em us-east-1, usar us-west-2 no client");
  }
});