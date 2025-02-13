function initVimEditor(page) {
  const pageContents = {
    help: [
      "",
      "JAKE'S VIM SIMULATOR HELP",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      "",
      "MODES:",
      "",
      "Normal Mode - Press <Esc> to enter",
      "Insert Mode - Press i to enter",
      "",
      "COMMANDS:",
      "",
      ":help<Enter>      - Show these instructions",
      ":home<Enter>     - Show home screen",
      ":about<Enter>     - Show about me",
      ":principles<Enter> - Show core principles",
      ":articles<Enter>  - Show all articles",
      ":q<Enter>         - Quit editor",
      "",
      "NAVIGATION:",
      "",
      "h - move left",
      "j - move down",
      "k - move up",
      "l - move right",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    ],
    about: [
      "",
      "WHAT ABOUT JAKE?",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      "",
      "DISCIPLINES:",
      "",
      "<ENGINEER/>      :   I like solving engineering problems",
      "*DESIGNER*       :   I like solving design problems",
      "!ENTREPRENEUR!   :   I like solving business problems",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      "",
      "ABOUT ME:",
      "",
      "Grew up in Chicago, IL",
      "Started programming at age 12",
      "Got my first programming job at age 15",
      "Built a software start-up with my dad",
      "Lived abroad for a few years after college",
      "Now live in California",
      "Work as a Design Engineer @Axiom",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    ],
    principles: [
      "",
      "JAKE'S FIRST PRINCIPLES",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      "",
      ">> Humans know no truth, only useful explanations.",
      ">> Science lets us measure how useful an explanation is.",
      ">> Computers are just VMs themselves.",
      ">> Art is the closest humans can get to the Universe.",
      ">> Credentialists believe more in bureaucracy than innovation.",
      ">> Clear and serious purpose beats having excess wealth.",
      ">> In the absence of a religion man will invent his own.",
      ">> Water invented man to carry itself uphill.",
      ">> Life is a paradox.",
      "",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    ],
    articles: [
      "ARTICLES DIR VIEW:",
      "move cursor to line and type<Enter> to read",
      "++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      "../",
      "<Using Good AI to Fights Bad AI>",
      "<How to Build a 3D FPS Game in the Web Browser>",
      "<What Really Is Complexity Anyway?>",
    ],
  };

  let lines = pageContents[page] || [""];
  let cursorPos = { line: 0, col: 0 };
  let scrollOffset = 0;
  let mode = "normal";
  let commandBuffer = "";
  let viewportSize = { rows: 0 };

  const container = document.getElementById("vim-emulator");
  container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 1.5rem);
      font-family: monospace;
      padding: 0;
      outline: none;
      cursor: text;
      line-height: 20px;
    `;
  container.setAttribute("tabindex", "0");

  const cmdDisplay = document.createElement("div");
  cmdDisplay.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.5rem;
      font-family: monospace;
      padding: 0 0.5rem;
      line-height: 1.5rem;
    `;
  document.body.appendChild(cmdDisplay);

  document.body.style.cssText = `
      margin: 0;
      padding: 0;
      height: 100vh;
      overflow: hidden;
    `;

  function calculateViewport() {
    viewportSize.rows = Math.floor(container.clientHeight / 20); // 20px line height
  }

  function getVisibleLines() {
    const displayLines = [...lines];
    const visibleLines = displayLines.slice(scrollOffset, scrollOffset + viewportSize.rows);
    while (visibleLines.length < viewportSize.rows) {
      visibleLines.push("~");
    }
    return visibleLines;
  }

  function render() {
    container.innerHTML = "";
    const visibleLines = getVisibleLines();

    visibleLines.forEach((line, i) => {
      const lineDiv = document.createElement("div");
      lineDiv.style.cssText = `
          position: relative;
          white-space: pre;
          height: 20px;
          padding: 0 .4rem;
          line-height: 20px;
        `;

      if (line === "~") {
        lineDiv.style.color = "#275959";
      }

      const actualLineIndex = scrollOffset + i;
      if (actualLineIndex === cursorPos.line) {
        const beforeCursor = line.slice(0, cursorPos.col);
        const atCursor = line[cursorPos.col] || " ";
        const afterCursor = line.slice(cursorPos.col + 1);

        const beforeText = document.createTextNode(beforeCursor);
        const cursorSpan = document.createElement("span");
        const charUnderCursor = document.createTextNode(atCursor);
        const afterText = document.createTextNode(afterCursor);

        cursorSpan.style.cssText = `
            display: inline-block;
            background: black;
            color: white;
            width: ${atCursor === " " ? "0.6em" : "auto"};
            height: 20px;
            line-height: 20px;
            vertical-align: top;
            position: relative;
            top: 0;
          `;

        cursorSpan.appendChild(charUnderCursor);
        lineDiv.appendChild(beforeText);
        lineDiv.appendChild(cursorSpan);
        lineDiv.appendChild(afterText);
      } else {
        lineDiv.textContent = line || " ";
      }

      container.appendChild(lineDiv);
    });

    if (mode === "command") {
      cmdDisplay.textContent = commandBuffer;
    } else {
      cmdDisplay.textContent = `${mode.toUpperCase()} MODE`;
    }
  }

  function scrollToCursor() {
    if (cursorPos.line < scrollOffset) {
      scrollOffset = cursorPos.line;
    } else if (cursorPos.line >= scrollOffset + viewportSize.rows) {
      scrollOffset = cursorPos.line - viewportSize.rows + 1;
    }
  }

  function handleCommand(cmd) {
    if (cmd === "help") {
      window.location.href = "./help.html";
    }
    if (cmd === "about") {
      window.location.href = "./about.html";
    }
    if (cmd === "principles") {
      window.location.href = "./principles.html";
    }
    if (cmd === "articles") {
      window.location.href = "./articles.html";
    }
    if (cmd === "q") {
      window.location.href = "https://www.google.com";
    }
    if (cmd === "home") {
      window.location.href = "./index.html";
    }
    mode = "normal";
    commandBuffer = "";
  }

  function handleNormalMode(e) {
    switch (e.key) {
      case ":":
        mode = "command";
        commandBuffer = ":";
        break;
      case "i":
        mode = "insert";
        break;
      // Left movement
      case "h":
      case "ArrowLeft":
        if (cursorPos.col > 0) cursorPos.col--;
        break;
      // Right movement
      case "l":
      case "ArrowRight":
        if (cursorPos.col < (lines[cursorPos.line]?.length || 0)) cursorPos.col++;
        break;
      // Down movement
      case "j":
      case "ArrowDown":
        if (cursorPos.line < lines.length - 1) {
          cursorPos.line++;
          const lineLength = lines[cursorPos.line].length;
          cursorPos.col = Math.min(cursorPos.col, lineLength);
          scrollToCursor();
        }
        break;
      // Up movement
      case "k":
      case "ArrowUp":
        if (cursorPos.line > 0) {
          cursorPos.line--;
          const lineLength = lines[cursorPos.line].length;
          cursorPos.col = Math.min(cursorPos.col, lineLength);
          scrollToCursor();
        }
        break;
    }
  }
  function handleCommandMode(e) {
    if (e.key === "Enter") {
      const cmd = commandBuffer.slice(1);
      handleCommand(cmd);
    } else if (e.key === "Escape") {
      mode = "normal";
      commandBuffer = "";
    } else if (e.key === "Backspace") {
      if (commandBuffer.length > 1) {
        commandBuffer = commandBuffer.slice(0, -1);
      }
    } else if (e.key.length === 1) {
      commandBuffer += e.key;
    }
  }

  function handleInsertMode(e) {
    if (e.key === "Escape") {
      mode = "normal";
    } else if (e.key === "Enter") {
      const currentLine = lines[cursorPos.line];
      const beforeCursor = currentLine.slice(0, cursorPos.col);
      const afterCursor = currentLine.slice(cursorPos.col);

      lines[cursorPos.line] = beforeCursor;
      lines.splice(cursorPos.line + 1, 0, afterCursor);

      cursorPos.line++;
      cursorPos.col = 0;
      scrollToCursor();
    } else if (e.key === "Backspace") {
      if (cursorPos.col === 0 && cursorPos.line > 0) {
        const currentLine = lines[cursorPos.line];
        lines.splice(cursorPos.line, 1);
        cursorPos.line--;
        cursorPos.col = lines[cursorPos.line].length;
        lines[cursorPos.line] += currentLine;
      } else if (cursorPos.col > 0) {
        const currentLine = lines[cursorPos.line];
        lines[cursorPos.line] = currentLine.slice(0, cursorPos.col - 1) + currentLine.slice(cursorPos.col);
        cursorPos.col--;
      }
    } else if (e.key.length === 1) {
      const currentLine = lines[cursorPos.line];
      lines[cursorPos.line] = currentLine.slice(0, cursorPos.col) + e.key + currentLine.slice(cursorPos.col);
      cursorPos.col++;
    }
  }

  window.addEventListener("keydown", (e) => {
    e.preventDefault();

    switch (mode) {
      case "normal":
        handleNormalMode(e);
        break;
      case "insert":
        handleInsertMode(e);
        break;
      case "command":
        handleCommandMode(e);
        break;
    }

    render();
  });

  window.addEventListener("wheel", (e) => {
    const linesBefore = cursorPos.line;
    if (e.deltaY > 0) {
      if (cursorPos.line < lines.length - 1) {
        cursorPos.line++;
        const lineLength = lines[cursorPos.line].length;
        cursorPos.col = Math.min(cursorPos.col, lineLength);
      }
    } else {
      if (cursorPos.line > 0) {
        cursorPos.line--;
        const lineLength = lines[cursorPos.line].length;
        cursorPos.col = Math.min(cursorPos.col, lineLength);
      }
    }
    if (linesBefore !== cursorPos.line) {
      scrollToCursor();
      render();
    }
  });

  window.addEventListener("resize", () => {
    calculateViewport();
    scrollToCursor();
    render();
  });

  calculateViewport();
  render();
  container.focus();
}
