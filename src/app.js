import hotkeys from "hotkeys-js";
import prettier from "prettier";

const CodeMirror = require("codemirror");
require("codemirror/mode/gfm/gfm");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/shell/shell");
require("codemirror/mode/yaml/yaml");
require("codemirror/mode/css/css");
require("codemirror/mode/yaml-frontmatter/yaml-frontmatter");
require("./style.css");

const defaultText = `ZenPad - as zen as it gets...

# Features:

  => Ligatures
  => Persistence
  => Auto Indentation
  => Syntax \`Highlighting\`
  => Save to file
  => **GitHub** _Flavoured_ <p>Markdown</p> :smile:

~ Made by Maximous Black (@maximousblk)`;

const yin = CodeMirror.fromTextArea(document.getElementById("yin"), {
  lineNumbers: false,
  indentWithTabs: false,
  mode: "yaml-frontmatter",
  gitHubSpice: true,
  theme: "dracula",
  styleActiveLines: true,
  highlightFormatting: true,
  matchBrackets: true,
  lineWrapping: true,
  autofocus: true,
  scrollbarStyle: "null",
});

if (!localStorage.getItem("yang")) {
  localStorage.setItem("yang", defaultText);
}

yin.on("change", writeLocalStorage);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", readLocalStorage);
} else {
  readLocalStorage();
}

function writeLocalStorage() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("yang", prettier.format(yin.getValue()));
  } else {
    console.log("Localstorage not supported");
  }
}

function readLocalStorage() {
  if (typeof Storage !== "undefined") {
    yin.setValue(localStorage.getItem("yang"));
  } else {
    console.log("Localstorage not supported");
  }
}

CodeMirror.commands.save = function (i) {
  saveFile();
};

hotkeys("ctrl+s", function (event) {
  event.preventDefault(); // Prevent the default refresh event on Windows
  saveFile();
});

function saveFile() {
  var text = yin.getValue();
  var text = text.replace(/\n/g, "\r\n"); // preserve line breaks for windows

  var blob = new Blob([text], { type: "text/markdown; charset=utf-8" });

  var filename = "zenpad.md";

  var link = document.createElement("a");
  link.style.display = "none";
  link.download = filename;
  link.innerHTML = ".";
  window.URL = window.URL || window.webkitURL;
  link.href = window.URL.createObjectURL(blob);
  link.target = "_blank";
  link.onclick = rmlink;
  document.body.appendChild(link);
  link.click();
}

function rmlink(e) {
  document.body.removeChild(e.target);
}
