import { Guideline } from "@sales-agent/db-connector";
import { ChatMessage } from "@sales-agent/types";

interface Options {
  systemIntro: string;
  globalGuidelines: Guideline[];
  dynamicGuidelines: Guideline[];
  summary: string;
  additionalInformation?: string;
}

export const buildPrompt = ({
  systemIntro,
  globalGuidelines,
  dynamicGuidelines,
  summary,
  additionalInformation,
}: Options): string => {
  const guidelines = [...globalGuidelines, ...dynamicGuidelines];

  const formattedGuidelines = guidelines
    .map((guideline) => `- ${guideline.content}`)
    .join("\n");

  const preparedPrompt = systemIntro
    .replace("[INSERT_GUIDELINES_HERE]", formattedGuidelines)
    .replace("[INSERT_SUMMARY_HERE]", summary)
    .replace("[INSERT_USER_INPUT_HERE]", additionalInformation ?? '')
    .trim();

  return preparedPrompt;
};

export const formatChat = (messages: ChatMessage[]) =>
  messages
    .map(
      (msg) => `${msg.role === "user" ? "Customer" : "Agent"}: ${msg.content}`
    )
    .join("\n");
