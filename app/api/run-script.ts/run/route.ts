import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptInstance";

const script = "app/api/run-script/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json();
  console.log("story", story);

  const opts: RunOpts = {
    disableCache: true,
    input: `--story ${story} --pages ${pages} --path ${path}`,
  };

  try {

    console.log("running script");
    console.log("story", story);
    console.log("pages", pages);
    console.log("path", path);
    // const encoder = new TextEncoder();
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       const run = await g.run(script, opts);
    //       run.on(RunEventType.Event, (output) => {
    //         controller.enqueue(
    //           encoder.encode(`event: ${JSON.stringify(output)}\n\n`)
    //         );
    //       });
    //       await run.text();
    //       controller.close();

    //       return new Response(stream, {
    //         headers: {
    //           "Content-Type": "text/event-stream",
    //           "Cache-Control": "no-cache",
    //           Connection: "keep-alive",
    //         },
    //       });
    //     } catch (error) {
    //       controller.error(error);
    //       console.error(error);
    //     }
    //   },
    // });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
