import { Frame } from "@gptscript-ai/gptscript";

const rendderEvent = (event: Frame) => {
  switch (event.type) {
    case "runStart":
      return <div>Run Started at {event.type}</div>;
    case "callStart":
      return (
        <div>
          <p>Tool Starting: {event.tool?.description}</p>
        </div>
      );
    case "callChat":
      return (
        <div>
          <p>Chat in progress with your input</p>
        </div>
      );
    case "callProgress":
      return null;

    case "callFinish":
      return (
        <div>
          call finished with output
          {event.output.map((output) => (
            <p key={output.content}>{output.content}</p>
          ))}
        </div>
      );

    case "runFinish":
      return <div>Run Finished</div>;

    case "callSubCalls":
      return (
        <div>
          <p>
            Subcalls in progress with your input:
            {event.output.map((output, index) => (
              <div key={index}>
                <div>{output.content}</div>
                {output.subCalls &&
                  Object.keys(output.subCalls).map((key) => (
                    <div key={key}>
                      <strong>subcall {key}:</strong>
                      <div>tool id {output.subCalls[key].toolID}</div>
                      <div>input {output.subCalls[key].input}</div>
                    </div>
                  ))}
              </div>
            ))}
          </p>
        </div>
      );
    case "callContinue":
      return (
        <div>
          <p>
            Subcalls in progress with your input:
            {event.output.map((output, index) => (
              <div key={index}>
                <div>{output.content}</div>
                {output.subCalls &&
                  Object.keys(output.subCalls).map((key) => (
                    <div key={key}>
                      <strong>subcall {key}:</strong>
                      <div>tool id {output.subCalls[key].toolID}</div>
                      <div>input {output.subCalls[key].input}</div>
                    </div>
                  ))}
              </div>
            ))}
          </p>
        </div>
      );

    default:
      return <pre>{JSON.stringify(event, null, 2)}</pre>;
  }
};
export default rendderEvent;
