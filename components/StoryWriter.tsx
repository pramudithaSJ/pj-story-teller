"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { Frame } from "@gptscript-ai/gptscript";
import renderEvent from "@/lib/renderEvent";

const storiesPath = "/Users/pramusj/Projects/pj-story-teller/public";

function StoryWriter() {
  const [story, setStory] = useState("");
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState("");
  const [runStart, setRunStart] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [events, setEvents] = useState<Frame[]>([]);

  async function runScript() {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if (response.ok && response.body) {
      console.log("response", response);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      handleStream(reader, decoder);
    } else {
      console.log("error");
      setRunFinished(true);
      setRunStart(false);
    }
  }

  async function handleStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const eventData = chunk
        .split("\n\n")
        .filter((line) => line.startsWith("event:"))
        .map((line) => line.replace("event:", ""));

      eventData.forEach((event) => {
        try {
          const parsedData = JSON.parse(event);
          if (parsedData.type === "callProgress") {
            setProgress(
              parsedData.output[parsedData.output.length - 1].content
            );
            setCurrentTool(parsedData.tool?.description || "");
          } else if (parsedData.type === "callStart") {
            setCurrentTool(parsedData.tool?.description || "");
          } else if (parsedData.type === "callEnd") {
            setRunFinished(true);
            setRunStart(false);
          } else {
            setEvents((prev) => [...prev, parsedData]);
          }
        } catch (error) {
          console.error("JSON parsing error:", error);
          console.error("Problematic JSON chunk:", event);
        }
      });
    }
  }

  return (
    <div className="flex flex-col w-full mr-auto ml-auto">
      <section className="flex-1 flex flex-col border border-purple-300 p-10 space-y-2 mx-2 rounded-md">
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="w-full flex-1 text-black"
          placeholder="Write your story here"
        />
        <Select onValueChange={(value) => setPages(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="How many pages should story be" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectGroup>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className="w-full"
          disabled={!story || !pages || runStart}
          onClick={() => {
            runScript();
          }}
        >
          <span>Generate Story</span>
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5 mx-2">
        <div className="flex flex-col-reverse w-full bg-gray-700 text-gray-200 rounded-md p-10 overflow-y-auto font-mono">
          <div>
            {runFinished === null && (
              <div className="animate-pulse mr-5">
                <p>I am waiting for your command</p>
              </div>
            )}
            <span className="mr-5">{">>"}</span>
            {progress}
          </div>
          {currentTool && (
            <div className="py-10">
              <span className="mr-5">
                {">>"}
                {"----[current tool]----"}
              </span>
              {currentTool}
            </div>
          )}
          <div>
            {events.map((event, index) => (
              <div key={index}>
                <span className="mr-5">{">>"}</span>
                {renderEvent(event)}
              </div>
            ))}
          </div>
          {runStart && (
            <div>
              <p className="mr-5">I am generating your story</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoryWriter;
