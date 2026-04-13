import { Mistral } from "@mistralai/mistralai";

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

const client = new Mistral({ apiKey });

export const checkSentence = async (sentence: string) => {
  const res = await client.chat.complete({
    model: "mistral-medium-latest",
    messages: [
      {
        role: "user",
        content: `Vérifiez si cette phrase est correcte: '${sentence}'. Répondre simplement.`,
      },
    ],
    temperature: 1,
  });

  return res.choices[0].message.content;
};

export const checkSentenceLong = async (sentence: string) => {
  const res = await client.chat.complete({
    model: "mistral-medium-latest",
    messages: [
      {
        role: "user",
        content: `Vérifiez si cette phrase est correcte: '${sentence}'.`,
      },
    ],
    temperature: 1,
  });

  return res.choices[0].message.content;
};

export const generateSentence = async (word: string, context: string) => {
  const res = await client.chat.complete({
    model: "mistral-medium-latest",
    messages: [
      {
        role: "user",
        content: `Donne-moi une phrase avec '${word}' dans ce contexte: '${context}'.`,
      },
    ],
    temperature: 1,
  });

  return res.choices[0].message.content;
};
