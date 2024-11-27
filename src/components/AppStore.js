// src/components/AppStore.js

import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  InputBase,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText as MuiListItemText,
  Rating,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtom, faBrain, faHeart } from "@fortawesome/free-solid-svg-icons";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// Import AceEditor
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const AppStore = ({ onAddApp, addAppToTabs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [apps, setApps] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [filteredApps, setFilteredApps] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Categories available
  const categories = [
    "Quantum Computing",
    "Artificial Intelligence",
    "Distributed Systems",
    // Add more categories as needed
  ];

  useEffect(() => {
    // Initialize apps
    const initialApps = [
      {
        id: "1",
        name: "Quantum Entanglement Simulator",
        icon: faAtom,
        category: "Quantum Computing",
        jtmlContent: `
operation EntangleQubits {
  action: {
    apply H to q1;
    apply CNOT to (q1, q2);
  };
  interval: prime(3);
  resource: QuantumProcessor1;
}
        `,
        dateAdded: "2024-10-20",
        ratings: [5, 4],
        popularity: 100,
        reviews: [],
      },
      {
        id: "2",
        name: "Adaptive Quantum Neural Network",
        icon: faBrain,
        category: "Artificial Intelligence",
        jtmlContent: `
model AdaptiveQNN {
  layers: [...];
  learning_rate: adaptive(prime_chain(2, 3, 5));
  resource: QuantumProcessor1;
}
        `,
        dateAdded: "2024-09-15",
        ratings: [4, 5],
        popularity: 150,
        reviews: [],
      },
      // ...other apps
    ];
    setApps(initialApps);
  }, []);

  useEffect(() => {
    filterAndSortApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, searchTerm, selectedCategories, sortBy]);

  // Define the custom JTML mode
  useEffect(() => {
    const ace = require("ace-builds/src-noconflict/ace");
    require("ace-builds/src-noconflict/ext-language_tools");

    // Define the JTML mode
    if (!ace.definedModes) {
      ace.definedModes = true;
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
                  token: "string",
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
    }
  }, []);

  // ... rest of your component code
  // Ensure that you use AceEditor where necessary, and that the component compiles successfully.

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {/* ... your existing JSX code ... */}
    </Box>
  );ss
};

export default AppStore;
