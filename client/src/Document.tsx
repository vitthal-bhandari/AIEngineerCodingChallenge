import Editor from "./internal/Editor";
import useWebSocket from "react-use-websocket";
import { debounce, last } from "lodash";
import { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  overflow-y: auto;
  height: 100%;
`;

export interface DocumentProps {
  onContentChange: (content: string) => void;
  content: string;
  setMessageHistory: (messageHistory: any) => void;
  setIsAiLoading: (isloading: boolean) => void;
}

const SOCKET_URL = "ws://localhost:8000/ws";

export default function Document({ onContentChange, content, setMessageHistory, setIsAiLoading }: DocumentProps) {

  const { sendMessage, lastMessage } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log("WebSocket Connected"),
    onClose: () => console.log("WebSocket Disconnected"),
    shouldReconnect: (_closeEvent) => true,
    // Optionally, you can configure WebSocket options here
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(JSON.parse(JSON.parse(lastMessage.data))["issues"]);
      setIsAiLoading(false)
      // Handle the incoming message as needed. For example, update the editor content or display suggestions.;
    }
  }, [lastMessage, setMessageHistory]);

  // Debounce editor content changes
  const sendEditorContent = useCallback(
    debounce((content: string) => {
      setIsAiLoading(true)
      sendMessage(content);
    }, 500), // Adjust debounce time as needed
    [sendMessage]
  );

  function convertToPlainText(html: string){

    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  const handleEditorChange = (content: string) => {
    const paragraph =  convertToPlainText(content);
    onContentChange(content);
    sendEditorContent(paragraph);
  };

  return (
    <Container>
      <Editor handleEditorChange={handleEditorChange} content={content} />
    </Container>
  );
}
