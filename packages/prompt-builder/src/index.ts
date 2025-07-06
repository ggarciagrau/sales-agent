import { Guideline } from "@sales-agent/db-connector";
import { ChatMessage } from "@sales-agent/types";

interface Options {
  systemIntro: string;
  globalGuidelines: Guideline[];
  dynamicGuidelines: Guideline[];
}

export const buildPrompt = ({
  systemIntro,
  globalGuidelines,
  dynamicGuidelines,
}: Options): string => {
  const preparedPrompt = systemIntro
    .replace(
      "[INSERT_GLOBAL_GUIDELINES_HERE]",
      formatGuidelines(globalGuidelines)
    )
    .replace(
      "[INSERT_DYNAMIC_GUIDELINES_HERE]",
      formatGuidelines(dynamicGuidelines)
    )
    .trim();

  return preparedPrompt;
};

export const formatChat = (messages: ChatMessage[]) =>
  messages
    .map(
      (msg) => `${msg.role === "user" ? "Customer" : "Agent"}: ${msg.content}`
    )
    .join("\n");

const formatGuidelines = (guidelines: Guideline[]) =>
  guidelines.map((guideline) => `- ${guideline.content}`).join("\n");
