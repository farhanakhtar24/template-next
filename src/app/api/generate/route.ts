import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "https://gethelium.co"); // Your frontend origin
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "https://gethelium.co"); // Your frontend origin
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
