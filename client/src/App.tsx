import styled from "@emotion/styled";
import Document from "./Document";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingOverlay from "./internal/LoadingOverlay";
import Logo from "./assets/logo.png";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.header`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  width: 100%;
  background-color: black;
  color: white;
  text-align: center;
  z-index: 1000;
  margin-bottom: 30px;
  height: 80px;
`;

const DocumentTitle = styled.h2`
  align-self: flex-start;
  color: #213547;
  opacity: 0.6;
`;

const Content = styled.div`
  display: flex;
  height: calc(100% - 100px);
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 90px 20px 20px 20px;
  width: calc(100% - 40px);
`;

interface ColumnProps {
  flex?: string | number;
}

const Column = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  flex: ${(props) => props.flex || "none"};
`;

const BACKEND_URL = "http://localhost:8000";

function App() {
  const [currentDocumentContent, setCurrentDocumentContent] =
    useState<string>("");

  const [currentDocumentId, setCurrentDocumentId] = useState<number>(0);
  const [currentDocumentVersion, setCurrentDocumentVersion] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load the first patent on mount
  useEffect(() => {
    loadPatent(1, 1);
  }, []);

  // Callback to load a patent from the backend
  const loadPatent = async (documentNumber: number, documentVersion: number) => {
    setIsLoading(true);
    console.log("Loading patent:", documentNumber);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/document`,
        {
          params: {
            document_id: documentNumber,
            document_version: documentVersion
          }
        }
      );
      setCurrentDocumentContent(response.data.content);
      setCurrentDocumentId(documentNumber);
      setCurrentDocumentVersion(documentVersion);
    } catch (error) {
      console.error("Error loading document:", error);
    }
    setIsLoading(false);
  };

  // Callback to persist a patent in the DB
  const savePatent = async (documentNumber: number, documentVersion: number) => {
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/save`, {
        content: currentDocumentContent,
      },
      {
        params: {
          document_id: documentNumber,
          document_version: documentVersion
        }
      }
    );
    } catch (error) {
      console.error("Error saving document:", error);
    }
    setIsLoading(false);
  };

  return (
    <Page>
      {isLoading && <LoadingOverlay />}
      <Header>
        <img src={Logo} alt="Logo" style={{ height: "50px" }} />
      </Header>
      <Content>
        <Column>
          <button onClick={() => loadPatent(1, 1)}>Patent 1</button>
          <button onClick={() => loadPatent(2, 1)}>Patent 2</button>
        </Column>
        <Column flex={1}>
          <DocumentTitle>{`Patent ${currentDocumentId}`}</DocumentTitle>
          <Document
            onContentChange={setCurrentDocumentContent}
            content={currentDocumentContent}
          />
        </Column>
        <Column>
          <button onClick={() => savePatent(currentDocumentId, currentDocumentVersion)}>Save</button>
        </Column>
      </Content>
    </Page>
  );
}

export default App;
