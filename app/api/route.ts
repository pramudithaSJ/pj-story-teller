import { NextRequest, NextResponse } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";

const script = "app/api/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json();

  const opts: RunOpts = {
    disableCache: true,
    input: `--story ${story} --pages ${pages} --path ${path}`,
  };

  try {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await g.run(script, opts);
          run.on(RunEventType.Event, (output) => {
            controller.enqueue(
              encoder.encode(`event: ${JSON.stringify(output)}\n\n`)
            );
          });
          await run.text();
          controller.close();
        } catch (error) {
          controller.error(error);
          console.error("Streaming error:", error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in POST function:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
