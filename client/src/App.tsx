import styled from "@emotion/styled";
import Document from "./Document";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingOverlay from "./internal/LoadingOverlay";
import Logo from "./assets/logo.png";
import { toInteger } from "lodash";
import { Modal, Typography } from "@mui/material";

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

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  border: 2px solid #000;
  box-shadow: 24px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalButtons = styled.div`
  display: flex;
  flex-direction: row;
`;

interface MyObject {
  [index: number]: number; // Or any other type you expect
}

const BACKEND_URL = "http://localhost:8000";

function App() {
  const [currentDocumentContent, setCurrentDocumentContent] =
    useState<string>("");

  const [currentDocumentId, setCurrentDocumentId] = useState<number>(0);
  const [currentDocumentVersion, setCurrentDocumentVersion] = useState<number>(0);
  const [allDocumentVersions, setAllDocumentVersions] = useState<MyObject>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Load the first patent on mount
  useEffect(() => {
    loadPatent(1, 1);
    getVersions();
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

  // Callback to persist a patent in the DB
  const createNewVersion = async (documentNumber: number, documentVersion: number, version_type: string) => {
    const newVersionContent = version_type === 'blank' ? "" : currentDocumentContent;
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/create_version`, {
        content: newVersionContent,
      },
      {
        params: {
          document_id: documentNumber,
          document_version: documentVersion
        }
      }
    );
    setCurrentDocumentContent(newVersionContent);
    setCurrentDocumentId(documentNumber);
    setCurrentDocumentVersion(documentVersion);
    getVersions();
    handleClose();
    } catch (error) {
      console.error("Error saving document:", error);
    }
    setIsLoading(false);
  };

  // Callback to load a patent from the backend
  const getVersions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/versions`,
      );
      setAllDocumentVersions(response.data);
    } catch (error) {
      console.error("Error loading versions:", error);
    }
    setIsLoading(false);
  };

  const handleIdSelect = (key: string) => {
    setCurrentDocumentId(toInteger(key))
  }

  const handleVersionSelect = (key: string) => {
    setCurrentDocumentVersion(toInteger(key))
  }

  const findMaxVersion = (data: any, id: number) => {
    // Get the list of versions for the specified ID
    const versions = data[id];
  
    // If the ID doesn't exist or has no versions, return 0
    if (!versions || versions.length === 0) {
      return 0;
    }
  
    // Find the maximum version using the Math.max function
    const maxVersion = Math.max(...versions);
  
    return maxVersion;
  }

  const ModalComponent = () => {
    const maxVersion = findMaxVersion(allDocumentVersions, currentDocumentId) + 1
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create new version
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }} style={{textAlign: "center"}}>
            {`You may choose one of the two options below to create v${maxVersion} of your patent draft.`}
          </Typography>
          <ModalButtons>
            <button onClick={() => createNewVersion(currentDocumentId, maxVersion, 'blank')}>Create Blank Draft</button>
            <button onClick={() => createNewVersion(currentDocumentId, maxVersion, 'copy')}>Copy Existing Draft</button>
          </ModalButtons>
        </Box>
      </Modal>
    )
  }

  const getPatent = (id: number, version: number) => {
    loadPatent(id, version)
  }
  return (
    <Page>
      {isLoading && <LoadingOverlay />}
      <Header>
        <img src={Logo} alt="Logo" style={{ height: "50px" }} />
      </Header>
      <Content>
        <Column>
        <div>
          <label>Patent</label>
          <select value={currentDocumentId} onChange={(e) => handleIdSelect(e.target.value)}>
            <option disabled value="">Patent</option>
            {allDocumentVersions && Object.keys(allDocumentVersions).map((key: any) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Version</label>
          <select value={currentDocumentVersion} onChange={(e) => handleVersionSelect(e.target.value)}>
            <option disabled value="">Version</option>
            {allDocumentVersions && allDocumentVersions[currentDocumentId] && allDocumentVersions[currentDocumentId].map((key: any) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <button className="opposite-button" onClick={() => getPatent(currentDocumentId, currentDocumentVersion)}>Get Patent</button>
        </Column>
        <Column flex={1}>
          <DocumentTitle>{`Patent ${currentDocumentId}`}</DocumentTitle>
          <Document
            onContentChange={setCurrentDocumentContent}
            content={currentDocumentContent}
          />
        </Column>
        <Column>
          <button onClick={() => savePatent(currentDocumentId, currentDocumentVersion)}>Save Changes</button>
          <button className="opposite-button" onClick={handleOpen}>Create New Version</button>
          <ModalComponent/>
        </Column>
      </Content>
    </Page>
  );
}

export default App;
