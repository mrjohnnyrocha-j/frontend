// src/components/JtmlEditor.js

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver"; // Handle worker scripts
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"; // Enable language tools for auto-completion
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExtensionIcon from "@mui/icons-material/Extension";
import VisualizationIcon from "@mui/icons-material/Equalizer";
import AddIcon from "@mui/icons-material/Add";
import { jtmlSnippets } from "../utils/jtmlSnippets"; // Import custom JTML snippets

const JtmlEditor = ({ onUpdate }) => {
  const [code, setCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);
  const [extensionsDrawerOpen, setExtensionsDrawerOpen] = useState(false);
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const [files, setFiles] = useState([
    { name: "index.jtml", content: "// Your JTML code here" },
    // Add more default files as needed
  ]);
  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [newFileName, setNewFileName] = useState("");
  const editorRef = useRef(null);

  /**
   * Handles updating the preview by passing the code to the parent component.
   */
  const handleUpdate = () => {
    if (code.trim() === "") {
      setSnackbarMessage("Editor is empty. Please enter some JTML code.");
      setSnackbarOpen(true);
      return;
    }
    onUpdate(code);
    setSnackbarMessage("Preview updated successfully!");
    setSnackbarOpen(true);
  };

  /**
   * Exports the current JTML code as a text file.
   */
  const handleExport = () => {
    if (code.trim() === "") {
      setSnackbarMessage("Editor is empty. Nothing to export.");
      setSnackbarOpen(true);
      return;
    }
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile.name;
    link.click();
    setSnackbarMessage("JTML code exported successfully!");
    setSnackbarOpen(true);
  };

  /**
   * Closes the snackbar notification.
   */
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  /**
   * Toggles the maximize state of the editor.
   */
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  /**
   * Handles tab change in the editor for different functionalities.
   * @param {object} event - The event object.
   * @param {number} newValue - The index of the selected tab.
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Opens the File Explorer drawer.
   */
  const openFileDrawer = () => {
    setFileDrawerOpen(true);
  };

  /**
   * Closes the File Explorer drawer.
   */
  const closeFileDrawer = () => {
    setFileDrawerOpen(false);
  };

  /**
   * Opens the Extensions Marketplace drawer.
   */
  const openExtensionsDrawer = () => {
    setExtensionsDrawerOpen(true);
  };

  /**
   * Closes the Extensions Marketplace drawer.
   */
  const closeExtensionsDrawer = () => {
    setExtensionsDrawerOpen(false);
  };

  /**
   * Opens the Dapp Visualizer dialog.
   */
  const openVisualizer = () => {
    setVisualizerOpen(true);
  };

  /**
   * Closes the Dapp Visualizer dialog.
   */
  const closeVisualizer = () => {
    setVisualizerOpen(false);
  };

  /**
   * Handles selecting a file from the File Explorer.
   * @param {object} file - The selected file object.
   */
  const selectFile = (file) => {
    setSelectedFile(file);
    setCode(file.content);
    closeFileDrawer();
  };

  /**
   * Handles adding a new file.
   */
  const addNewFile = () => {
    if (newFileName.trim() === "") {
      setSnackbarMessage("File name cannot be empty.");
      setSnackbarOpen(true);
      return;
    }
    // Check for duplicate file names
    const duplicate = files.find((file) => file.name === newFileName);
    if (duplicate) {
      setSnackbarMessage("File name already exists.");
      setSnackbarOpen(true);
      return;
    }
    const newFile = { name: newFileName, content: "" };
    setFiles([...files, newFile]);
    setSelectedFile(newFile);
    setCode("");
    setNewFileName("");
    setSnackbarMessage(`File "${newFileName}" created successfully.`);
    setSnackbarOpen(true);
  };

  /**
   * Integrate custom JTML snippets into Ace Editor.
   */
  useEffect(() => {
    const ace = require("ace-builds/src-noconflict/ace");
    require("ace-builds/src-noconflict/ext-language_tools");

    const langTools = ace.require("ace/ext/language_tools");

    // Define the JTML mode
    ace.define(
      "ace/mode/jtml",
      ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/text_highlight_rules"],
      function (require, exports, module) {
        const oop = require("ace/lib/oop");
        const TextMode = require("ace/mode/text").Mode;
        const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

        const JTMLHighlightRules = function () {
          this.$rules = {
            start: [
              {
                token: "comment",
                regex: "//.*$",
              },
              {
                token: "string", // single line
                regex: '".*?"',
              },
              {
                token: "constant.numeric",
                regex: "\\b(?:prime\\(\\d+\\)|\\d+)\\b",
              },
              {
                token: "keyword",
                regex:
                  "\\b(operation|model|if|then|else|schedule|action|interval|resource|apply|measure|query|select|from|where|model|function)\\b",
              },
              {
                token: "variable",
                regex: "\\b\\w+\\b",
              },
              {
                token: "paren.lparen",
                regex: "[\\[{(]",
              },
              {
                token: "paren.rparen",
                regex: "[\\]}\\)]",
              },
              {
                token: "text",
                regex: "\\s+",
              },
            ],
          };
        };
        oop.inherits(JTMLHighlightRules, TextHighlightRules);

        const JTMLMode = function () {
          this.HighlightRules = JTMLHighlightRules;
          this.$behaviour = this.$defaultBehaviour;
        };
        oop.inherits(JTMLMode, TextMode);

        (function () {
          this.lineCommentStart = "//";
          this.$id = "ace/mode/jtml";
        }.call(JTMLMode.prototype));

        exports.Mode = JTMLMode;
      }
    );

    // Set the mode to JTML
    const editor = editorRef.current.editor;
    editor.session.setMode("ace/mode/jtml");

    // Register snippets
    langTools.addCompleter({
      getCompletions: function (editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
          callback(null, []);
          return;
        }
        const completions = jtmlSnippets.map((snippet) => ({
          caption: snippet.name,
          value: snippet.value,
          meta: snippet.description,
        }));
        callback(null, completions);
      },
    });
  }, []);

  /**
   * Persist files to localStorage for data persistence.
   */
  useEffect(() => {
    // Load files from localStorage if available
    const storedFiles = JSON.parse(localStorage.getItem("jtmlFiles"));
    if (storedFiles && Array.isArray(storedFiles)) {
      setFiles(storedFiles);
      const currentFile = storedFiles.find((file) => file.name === selectedFile.name);
      if (currentFile) {
        setSelectedFile(currentFile);
        setCode(currentFile.content);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Save files to localStorage whenever they change
    localStorage.setItem("jtmlFiles", JSON.stringify(files));
  }, [files]);

  return (
    <Box
      sx={{
        mb: 3,
        position: "relative",
        height: isMaximized ? "90vh" : "auto",
        width: isMaximized ? "95vw" : "100%",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header with Tabs and Maximize Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<FolderOpenIcon />} label="File Explorer" />
          <Tab icon={<ExtensionIcon />} label="Extensions" />
          <Tab icon={<VisualizationIcon />} label="Visualizer" />
        </Tabs>
        <Tooltip title={isMaximized ? "Exit Full Screen" : "Maximize Editor"}>
          <IconButton onClick={toggleMaximize}>
            {isMaximized ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 0 && (
        <>
          {/* File Explorer Drawer */}
          <Drawer anchor="left" open={fileDrawerOpen} onClose={closeFileDrawer}>
            <Box sx={{ width: 250, p: 2 }}>
              <Typography variant="h6">File Explorer</Typography>
              <List>
                {files.map((file, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => selectFile(file)}
                    selected={selectedFile.name === file.name}
                  >
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="New File Name"
                  variant="outlined"
                  size="small"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  fullWidth
                />
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                  onClick={addNewFile}
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  Add File
                </Button>
              </Box>
            </Box>
          </Drawer>
          {/* Open File Explorer Button */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FolderOpenIcon />}
            onClick={openFileDrawer}
            sx={{ mb: 2 }}
          >
            Open Files
          </Button>
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Extensions Drawer */}
          <Drawer anchor="left" open={extensionsDrawerOpen} onClose={closeExtensionsDrawer}>
            <Box sx={{ width: 300, p: 2 }}>
              <Typography variant="h6">Extensions Marketplace</Typography>
              {/* Existing functionalities */}
            </Box>
          </Drawer>
          {/* Open Extensions Marketplace Button */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ExtensionIcon />}
            onClick={openExtensionsDrawer}
            sx={{ mb: 2 }}
          >
            Extensions
          </Button>
        </>
      )}

      {activeTab === 2 && (
        <>
          {/* Dapp Visualizer Dialog */}
          <Dialog open={visualizerOpen} onClose={closeVisualizer} maxWidth="lg" fullWidth>
            <DialogTitle>
              Dapp Visualizer
              <IconButton
                aria-label="close"
                onClick={closeVisualizer}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {/* Integrate a Dapp visualizer component or iframe here */}
              <iframe
                title="Dapp Visualizer"
                srcDoc={code}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              ></iframe>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeVisualizer} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {/* Open Dapp Visualizer Button */}
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<VisualizationIcon />}
            onClick={openVisualizer}
            sx={{ mb: 2 }}
          >
            Visualize Dapp
          </Button>
        </>
      )}

      {/* Ace Editor */}
      <AceEditor
        mode="jtml"
        theme="github"
        onChange={(value) => setCode(value)}
        value={code}
        name="jtml-editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height={isMaximized ? "70vh" : "300px"}
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        ref={editorRef}
      />

      {/* Editor Action Buttons */}
      <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Preview
        </Button>
        <Button variant="outlined" color="primary" onClick={handleExport}>
          Export Code
        </Button>
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </Box>
  );
};

export default JtmlEditor;
