import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { websiteContent, question } = await request.json();
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            "You are a web scraper. Take the text from the following website as input and answer the questions asked by the user. Make sure the answers are relevant to the context provided. If the question is not related to the context, answer 'I don't know'.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Here is the website content: ${websiteContent}`,
            },
            {
              type: "text",
              text: `${question}`,
            },
          ],
        },
      ],
    });

    console.log(`The answer is: ${text}`);

    return NextResponse.json({ text });
  } catch (error) {
    console.log(`An error occurred: ${error}`);
  }
}
