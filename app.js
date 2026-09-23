(() => {
  "use strict";

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  const tools = [

    {
      id: "small-font",
      icon: "𝒜",
      name: "Small Font Generator",
      category: "Text & Fonts",
      desc: "Convert plain text into a compact Unicode small-cap style."
    },

    {
      id: "emoji",
      icon: "☺",
      name: "Emoji & Symbol Copy",
      category: "Text & Fonts",
      desc: "Search and copy real Unicode emoji and symbols."
    },

    {
      id: "hex",
      icon: "◉",
      name: "HEX Color Generator",
      category: "Colors",
      desc: "Convert HEX into RGB, HSL, MiniMessage and Minecraft RGB."
    },

    {
      id: "gradient",
      icon: "〰",
      name: "Gradient Generator",
      category: "Colors",
      desc: "Build live MiniMessage and per-character color gradients."
    },

    {
      id: "minimessage",
      icon: "<>",
      name: "MiniMessage Builder",
      category: "Messages",
      desc: "Preview and generate common MiniMessage formats."
    },

    {
      id: "title",
      icon: "▣",
      name: "Title Generator",
      category: "Messages",
      desc: "Generate ready-to-paste title, actionbar and tellraw commands."
    },

    {
      id: "motd",
      icon: "☄",
      name: "MOTD Generator",
      category: "Server Tools",
      desc: "Create two-line MOTDs with modern color syntax."
    },

    {
      id: "gui",
      icon: "▦",
      name: "GUI Builder",
      category: "GUI Tools",
      desc: "Design a clickable inventory grid and export starter YAML."
    },

    {
      id: "model",
      icon: "◇",
      name: "Sprite Model Generator",
      category: "Resource Packs",
      desc: "Generate an item model JSON file for custom model data."
    },

    {
      id: "fontjson",
      icon: "Aa",
      name: "Font JSON Generator",
      category: "Resource Packs",
      desc: "Create valid bitmap font provider JSON."
    },

    {
      id: "plugin",
      icon: "⌘",
      name: "plugin.yml Generator",
      category: "Plugins",
      desc: "Generate a clean Paper/Spigot plugin descriptor."
    },

    {
      id: "json",
      icon: "{ }",
      name: "JSON Formatter & Validator",
      category: "Config Tools",
      desc: "Format, minify and validate JSON entirely locally."
    },

    {
      id: "yaml",
      icon: "≡",
      name: "YAML Helper",
      category: "Config Tools",
      desc: "Indent and inspect YAML-style configuration text."
    },

    {
      id: "command",
      icon: "/",
      name: "Command Generator",
      category: "Commands",
      desc: "Build a starter command for give, tellraw or playsound."
    }

  ];


  const emojiData = [

    ["😀", "grinning face", "Smileys"],
    ["✨", "sparkles", "Stars"],
    ["⚔", "crossed swords", "Gaming"],
    ["⚡", "high voltage", "Symbols"],
    ["❤", "red heart", "Symbols"],
    ["☄", "comet", "Nature"],
    ["✦", "four pointed star", "Stars"],
    ["☀", "sun", "Nature"],
    ["☕", "hot beverage", "Food"],
    ["🎮", "video game", "Gaming"],
    ["⌘", "command key", "Technology"],
    ["⚙", "gear", "Technology"],
    ["➜", "right arrow", "Arrows"],
    ["▲", "up triangle", "Shapes"],
    ["◆", "diamond", "Shapes"],
    ["₿", "bitcoin sign", "Currency"],
    ["∞", "infinity", "Math"],
    ["✓", "check mark", "Symbols"],
    ["☠", "skull and crossbones", "Gaming"],
    ["⚒", "hammer and pick", "Objects"]

  ];


  const favs = () =>
    JSON.parse(localStorage.getItem("astra-favorites") || "[]");


  const saveFavs = value =>
    localStorage.setItem(
      "astra-favorites",
      JSON.stringify(value)
    );


  const recent = () =>
    JSON.parse(localStorage.getItem("astra-recent") || "[]");


  const saveRecent = value =>
    localStorage.setItem(
      "astra-recent",
      JSON.stringify(value.slice(0, 8))
    );


  function toast(message = "✓ Copied!") {

    const element = $("#toast");

    if (!element) return;

    element.textContent = message;
    element.className = "toast show";

    setTimeout(() => {
      element.className = "toast";
    }, 1800);

  }


  async function copy(text) {

    try {

      await navigator.clipboard.writeText(text);
      toast();

    } catch {

      const textarea = document.createElement("textarea");

      textarea.value = text;

      document.body.appendChild(textarea);

      textarea.select();

      document.execCommand("copy");

      textarea.remove();

      toast();

    }

  }


  function download(
    filename,
    text,
    type = "text/plain"
  ) {

    const link = document.createElement("a");

    link.href = URL.createObjectURL(
      new Blob([text], { type })
    );

    link.download = filename;

    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);

    toast("✓ Download ready!");

  }


  function esc(value) {

    return String(value).replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character])
    );

  }


  function renderTools(list = tools) {

    const favorites = favs();

    const grid = $("#toolGrid");

    if (!grid) return;

    grid.innerHTML =
      list.map(tool => {

        const favorite =
          favorites.includes(tool.id);

        return `
          <article
            class="tool-card"
            data-tool="${tool.id}"
          >

            <button
              class="favorite ${favorite ? "on" : ""}"
              data-fav="${tool.id}"
              aria-label="Favorite ${tool.name}"
            >
              ${favorite ? "★" : "☆"}
            </button>

            <div class="tool-icon">
              ${tool.icon}
            </div>

            <h3>${tool.name}</h3>

            <p>${tool.desc}</p>

            <span class="tool-tag">
              ${tool.category.toUpperCase()}
            </span>

          </article>
        `;

      }).join("") ||
      "<p>No matching tools found.</p>";

  }


  renderTools();


  function openTool(id) {

    const tool =
      tools.find(item => item.id === id);

    if (!tool) return;

    saveRecent([
      id,
      ...recent().filter(item => item !== id)
    ]);

    $("#toolContent").innerHTML =
      toolHTML(id, tool);

    $("#toolModal").classList.add("open");

    $("#toolModal")
      .setAttribute("aria-hidden", "false");

    bindTool(id);

  }


  function closeAll() {

    $$(".modal.open").forEach(modal => {

      modal.classList.remove("open");

      modal.setAttribute(
        "aria-hidden",
        "true"
      );

    });

  }


  function output(
    label,
    id,
    text = "",
    extension = "txt"
  ) {

    return `
      <div class="panel">

        <h3>${label}</h3>

        <pre
          class="output"
          id="${id}"
        >${esc(text)}</pre>

        <div class="output-actions">

          <button
            class="mini-btn"
            data-copy="#${id}"
          >
            Copy
          </button>

          <button
            class="mini-btn"
            data-download="#${id}"
            data-ext="${extension}"
          >
            Download
          </button>

        </div>

      </div>
    `;

  }


  function toolHTML(id, tool) {

    const header = `

      <div class="tool-header">

        <div class="eyebrow">
          <span></span>
          ${tool.category.toUpperCase()}
        </div>

        <h2 id="toolTitle">
          ${tool.name}
        </h2>

        <p>
          ${tool.desc}
          Works locally and preserves your formatting.
        </p>

      </div>

    `;


    if (id === "small-font") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Input</h3>

            <label class="field">
              TEXT
              <textarea
                id="textInput"
                placeholder="AstraUtilities"
              >AstraUtilities</textarea>
            </label>

            <button
              class="btn primary"
              id="generate"
            >
              Generate small font
            </button>

          </div>

          ${output(
            "Generated text",
            "result"
          )}

        </div>

      `;

    }


    if (id === "emoji") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Emoji & symbol library</h3>

            <label class="field">
              SEARCH
              <input
                id="emojiSearch"
                placeholder="Search stars, gaming, arrows..."
              >
            </label>

            <div
              id="emojiList"
              class="emoji-list"
            ></div>

          </div>

          <div class="panel">

            <h3>Selected collection</h3>

            <pre
              class="output"
              id="selectedEmoji"
            ></pre>

            <div class="output-actions">

              <button
                class="mini-btn"
                data-copy="#selectedEmoji"
              >
                Copy selected
              </button>

              <button
                class="mini-btn"
                id="clearEmoji"
              >
                Clear
              </button>

            </div>

            <p class="notice">
              Click Add to build a collection.
            </p>

          </div>

        </div>

      `;

    }


    if (id === "hex") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Color input</h3>

            <div class="form-row">

              <label class="field">
                HEX
                <input
                  id="hexInput"
                  value="#8B5CF6"
                >
              </label>

              <label class="field">
                PICKER
                <input
                  id="colorPicker"
                  type="color"
                  value="#8b5cf6"
                >
              </label>

            </div>

            <div
              class="color-swatch"
              id="swatch"
            ></div>

            <p
              class="notice"
              id="colorError"
            ></p>

          </div>

          <div id="colorOutputs"></div>

        </div>

      `;

    }


    if (id === "gradient") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Gradient editor</h3>

            <label class="field">
              TEXT
              <input
                id="gradText"
                value="AstraUtilities"
              >
            </label>

            <div class="form-row">

              <label class="field">
                START
                <input
                  id="gradStart"
                  type="color"
                  value="#8B5CF6"
                >
              </label>

              <label class="field">
                END
                <input
                  id="gradEnd"
                  type="color"
                  value="#06B6D4"
                >
              </label>

            </div>

            <button
              class="mini-btn"
              id="reverseGradient"
            >
              Reverse
            </button>

            <button
              class="mini-btn"
              id="randomGradient"
            >
              Randomize
            </button>

          </div>

          <div>

            <div class="panel">

              <h3>Live preview</h3>

              <div
                class="output gradient-text"
                id="gradPreview"
              ></div>

            </div>

            ${output(
              "MiniMessage",
              "gradMini"
            )}

            ${output(
              "Character-by-character Minecraft RGB",
              "gradChars"
            )}

          </div>

        </div>

      `;

    }


    if (id === "minimessage") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Message</h3>

            <label class="field">
              MINIMESSAGE

              <textarea id="miniInput"><gradient:#8B5CF6:#06B6D4><bold>AstraUtilities</bold></gradient></textarea>

            </label>

            <div class="tool-tabs">

              <button
                class="tab"
                data-insert="<bold></bold>"
              >
                Bold
              </button>

              <button
                class="tab"
                data-insert="<italic></italic>"
              >
                Italic
              </button>

              <button
                class="tab"
                data-insert="<rainbow></rainbow>"
              >
                Rainbow
              </button>

              <button
                class="tab"
                data-insert="<color:#8B5CF6></color>"
              >
                Color
              </button>

            </div>

            <p
              class="notice"
              id="miniStatus"
            ></p>

          </div>

          <div>

            ${output(
              "Preview",
              "miniPreview"
            )}

            ${output(
              "Copyable MiniMessage",
              "miniResult"
            )}

          </div>

        </div>

      `;

    }


    if (id === "title") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Message command</h3>

            <label class="field">
              TYPE

              <select id="msgType">

                <option value="title">
                  Title
                </option>

                <option value="actionbar">
                  Actionbar
                </option>

                <option value="tellraw">
                  Tellraw
                </option>

                <option value="bossbar">
                  Bossbar
                </option>

              </select>

            </label>

            <label class="field">
              TEXT
              <input
                id="msgText"
                value="Welcome to AstraUtilities"
              >
            </label>

            <label class="field">
              COLOR
              <input
                id="msgColor"
                value="#8B5CF6"
              >
            </label>

            <label class="field">
              TARGET
              <input
                id="msgTarget"
                value="@a"
              >
            </label>

          </div>

          ${output(
            "Ready-to-paste command",
            "commandOut"
          )}

        </div>

      `;

    }


    if (id === "motd") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Server MOTD</h3>

            <label class="field">
              LINE ONE

              <input
                id="motd1"
                value="<gradient:#8B5CF6:#06B6D4>Astra Server</gradient>"
              >
            </label>

            <label class="field">
              LINE TWO

              <input
                id="motd2"
                value="<gray>Free tools • No login required"
              >
            </label>

          </div>

          <div>

            ${output(
              "server.properties MOTD",
              "motdOut"
            )}

            ${output(
              "MiniMessage source",
              "motdMini"
            )}

          </div>

        </div>

      `;

    }


    if (id === "gui") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Inventory layout</h3>

            <div class="form-row">

              <label class="field">
                ROWS

                <select id="guiRows">

                  <option>3</option>
                  <option>1</option>
                  <option>2</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>

                </select>

              </label>

              <label class="field">
                TITLE

                <input
                  id="guiTitle"
                  value="&8Astra Menu"
                >

              </label>

            </div>

            <div
              class="slot-grid"
              id="slotGrid"
            ></div>

            <p class="notice">
              Click a slot to toggle a DIAMOND item.
            </p>

          </div>

          ${output(
            "Starter DeluxeMenus YAML",
            "guiOut"
          )}

        </div>

      `;

    }


    if (id === "model") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Item model</h3>

            <label class="field">
              MODEL NAME
              <input
                id="modelName"
                value="astra_blade"
              >
            </label>

            <label class="field">
              TEXTURE PATH
              <input
                id="texturePath"
                value="astra:item/astra_blade"
              >
            </label>

            <label class="field">
              CUSTOM MODEL DATA

              <input
                id="cmd"
                type="number"
                value="10001"
              >

            </label>

          </div>

          ${output(
            "Model JSON",
            "modelOut"
          )}

        </div>

      `;

    }


    if (id === "fontjson") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Bitmap provider</h3>

            <label class="field">
              CHARACTER
              <input
                id="fontChar"
                value="✦"
              >
            </label>

            <label class="field">
              TEXTURE PATH

              <input
                id="fontTexture"
                value="astra:font/icons.png"
              >

            </label>

            <div class="form-row">

              <label class="field">
                HEIGHT
                <input
                  id="fontHeight"
                  type="number"
                  value="8"
                >
              </label>

              <label class="field">
                ASCENT
                <input
                  id="fontAscent"
                  type="number"
                  value="7"
                >
              </label>

            </div>

          </div>

          ${output(
            "Font JSON",
            "fontOut"
          )}

        </div>

      `;

    }


    if (id === "plugin") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>Plugin details</h3>

            <label class="field">
              NAME

              <input
                id="pluginName"
                value="AstraPlugin"
              >
            </label>

            <label class="field">
              VERSION

              <input
                id="pluginVersion"
                value="1.0.0"
              >
            </label>

            <label class="field">
              MAIN CLASS

              <input
                id="pluginMain"
                value="com.example.astra.AstraPlugin"
              >
            </label>

            <label class="field">
              API VERSION

              <input
                id="pluginApi"
                value="1.21"
              >
            </label>

          </div>

          ${output(
            "plugin.yml",
            "pluginOut"
          )}

        </div>

      `;

    }


    if (id === "json") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>JSON input</h3>

            <label class="field">

              PASTE JSON

              <textarea id="jsonInput">{"name":"AstraUtilities","free":true}</textarea>

            </label>

            <div class="output-actions">

              <button
                class="mini-btn"
                id="formatJson"
              >
                Format
              </button>

              <button
                class="mini-btn"
                id="minifyJson"
              >
                Minify
              </button>

            </div>

            <p
              class="notice"
              id="jsonStatus"
            ></p>

          </div>

          ${output(
            "Result",
            "jsonOut"
          )}

        </div>

      `;

    }


    if (id === "yaml") {

      return header + `

        <div class="tool-layout">

          <div class="panel">

            <h3>YAML input</h3>

            <label class="field">

              PASTE YAML

              <textarea id="yamlInput">items:
  astra_blade:
    display_name: "Astra Blade"
    amount: 1</textarea>

            </label>

            <button
              class="mini-btn"
              id="formatYaml"
            >
              Normalize indentation
            </button>

            <p
              class="notice"
              id="yamlStatus"
            ></p>

          </div>

          ${output(
            "Result",
            "yamlOut"
          )}

        </div>

      `;

    }


    return header + `

      <div class="tool-layout">

        <div class="panel">

          <h3>Command builder</h3>

          <label class="field">

            COMMAND

            <select id="commandType">

              <option value="give">
                /give
              </option>

              <option value="tellraw">
                /tellraw
              </option>

              <option value="playsound">
                /playsound
              </option>

            </select>

          </label>

          <label class="field">

            TARGET

            <input
              id="cmdTarget"
              value="@p"
            >

          </label>

          <label class="field">

            VALUE

            <input
              id="cmdValue"
              value="minecraft:diamond 1"
            >

          </label>

        </div>

        ${output(
          "Generated command",
          "builderOut"
        )}

      </div>

    `;

  }


  function setOut(id, text) {

    const element = $(id);

    if (element) {
      element.textContent = text;
    }

  }


  const smallMap = {

    a: "ᴀ",
    b: "ʙ",
    c: "ᴄ",
    d: "ᴅ",
    e: "ᴇ",
    f: "ꜰ",
    g: "ɢ",
    h: "ʜ",
    i: "ɪ",
    j: "ᴊ",
    k: "ᴋ",
    l: "ʟ",
    m: "ᴍ",
    n: "ɴ",
    o: "ᴏ",
    p: "ᴘ",
    q: "ǫ",
    r: "ʀ",
    s: "ꜱ",
    t: "ᴛ",
    u: "ᴜ",
    v: "ᴠ",
    w: "ᴡ",
    x: "x",
    y: "ʏ",
    z: "ᴢ"

  };


  function hexToRgb(hex) {

    hex = hex.replace("#", "");

    if (!/^[\da-f]{6}$/i.test(hex)) {
      return null;
    }

    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];

  }


  function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    let s;

    const l = (max + min) / 2;

    if (max === min) {

      h = 0;
      s = 0;

    } else {

      const d = max - min;

      s =
        l > 0.5
          ? d / (2 - max - min)
          : d / (max + min);

      switch (max) {

        case r:
          h =
            (g - b) / d +
            (g < b ? 6 : 0);
          break;

        case g:
          h =
            (b - r) / d +
            2;
          break;

        default:
          h =
            (r - g) / d +
            4;

      }

      h /= 6;

    }

    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100)
    ];

  }


  function interpolate(a, b, t) {

    return a.map(
      (value, index) =>
        Math.round(
          value +
          (b[index] - value) * t
        )
    );

  }


  function rgbHex(rgb) {

    return (
      "#" +
      rgb
        .map(value =>
          value
            .toString(16)
            .padStart(2, "0")
        )
        .join("")
        .toUpperCase()
    );

  }


  function bindTool(id) {

    $$("[data-copy]").forEach(button => {

      button.onclick = () =>
        copy(
          $(button.dataset.copy).textContent
        );

    });


    $$("[data-download]").forEach(button => {

      button.onclick = () => {

        const element =
          $(button.dataset.download);

        download(
          "astra-output." +
          button.dataset.ext,
          element.textContent
        );

      };

    });


    if (id === "small-font") {

      const generate = () => {

        const value =
          $("#textInput").value || "";

        setOut(
          "#result",
          [...value]
            .map(
              character =>
                smallMap[
                  character.toLowerCase()
                ] || character
            )
            .join("")
        );

      };

      $("#textInput").oninput = generate;

      $("#generate").onclick = generate;

      generate();

    }


    if (id === "emoji") {

      let selected = [];

      const render = () => {

        const query =
          $("#emojiSearch")
            .value
            .toLowerCase();

        $("#emojiList").innerHTML =
          emojiData
            .map((item, index) => ({
              item,
              index
            }))
            .filter(
              object =>
                object.item[1]
                  .toLowerCase()
                  .includes(query) ||
                object.item[2]
                  .toLowerCase()
                  .includes(query) ||
                object.item[0].includes(query)
            )
            .map(object => {

              const emoji = object.item;

              return `
                <div class="emoji-row">

                  <b>${emoji[0]}</b>

                  <span>
                    ${emoji[1]}
                    <small>
                      ${emoji[2]}
                    </small>
                  </span>

                  <button
                    class="mini-btn"
                    data-add="${object.index}"
                  >
                    Add
                  </button>

                  <button
                    class="mini-btn"
                    data-one="${object.index}"
                  >
                    Copy
                  </button>

                </div>
              `;

            })
            .join("") ||
          '<p class="notice">No symbols found.</p>';


        $$("[data-add]").forEach(button => {

          button.onclick = () => {

            selected.push(
              emojiData[
                button.dataset.add
              ][0]
            );

            setOut(
              "#selectedEmoji",
              selected.join("")
            );

            toast("Added to collection");

          };

        });


        $$("[data-one]").forEach(button => {

          button.onclick = () =>
            copy(
              emojiData[
                button.dataset.one
              ][0]
            );

        });

      };


      $("#emojiSearch").oninput = render;

      $("#clearEmoji").onclick = () => {

        selected = [];

        setOut(
          "#selectedEmoji",
          ""
        );

      };

      render();

    }


    if (id === "hex") {

      const generate = () => {

        const raw =
          $("#hexInput").value
            .replace("#", "")
            .trim();

        const rgb = hexToRgb(raw);

        if (!rgb) {

          $("#colorError").textContent =
            "Invalid HEX color. Use #RRGGBB.";

          $("#colorOutputs").innerHTML = "";

          return;

        }

        const hex =
          "#" + raw.toUpperCase();

        const [
          r,
          g,
          b
        ] = rgb;

        const [
          h,
          s,
          l
        ] = rgbToHsl(r, g, b);

        $("#hexInput").value = hex;

        $("#colorPicker").value = hex;

        $("#swatch").style.background =
          hex;

        $("#colorError").textContent = "";

        const legacy =
          "§x§" +
          raw
            .split("")
            .join("§");

        $("#colorOutputs").innerHTML =
          output(
            "Color formats",
            "hexOut",
`HEX
${hex}

RGB
rgb(${r}, ${g}, ${b})

HSL
hsl(${h}, ${s}%, ${l}%)

Minecraft HEX
&#${raw}

MiniMessage
<color:${hex}>

Legacy RGB
${legacy}

Ampersand RGB
${legacy.replaceAll("§", "&")}

Minecraft JSON
{"text":"Astra","color":"${hex}"}`,
            "txt"
          );

        $$("[data-copy]").forEach(button => {

          button.onclick = () =>
            copy(
              $(button.dataset.copy)
                .textContent
            );

        });

      };


      $("#hexInput").oninput = generate;

      $("#colorPicker").oninput = () => {

        $("#hexInput").value =
          $("#colorPicker").value;

        generate();

      };

      generate();

    }


    if (id === "gradient") {

      const generate = () => {

        const text =
          $("#gradText").value ||
          "AstraUtilities";

        const start =
          hexToRgb(
            $("#gradStart").value
          );

        const end =
          hexToRgb(
            $("#gradEnd").value
          );

        $("#gradPreview").innerHTML =
          [...text]
            .map((character, index) => {

              const progress =
                text.length < 2
                  ? 0
                  : index /
                    (text.length - 1);

              return `
                <span
                  style="color:${rgbHex(
                    interpolate(
                      start,
                      end,
                      progress
                    )
                  )}"
                >
                  ${esc(character)}
                </span>
              `;

            })
            .join("");


        setOut(
          "#gradMini",
          `<gradient:${$("#gradStart").value.toUpperCase()}:${$("#gradEnd").value.toUpperCase()}>${text}</gradient>`
        );


        setOut(
          "#gradChars",
          [...text]
            .map((character, index) => {

              const progress =
                text.length < 2
                  ? 0
                  : index /
                    (text.length - 1);

              const hex =
                rgbHex(
                  interpolate(
                    start,
                    end,
                    progress
                  )
                ).slice(1);

              return (
                "§x§" +
                hex.split("").join("§") +
                character
              );

            })
            .join("")
        );

      };


      [
        "#gradText",
        "#gradStart",
        "#gradEnd"
      ].forEach(selector => {

        $(selector).oninput = generate;

      });


      $("#reverseGradient").onclick = () => {

        const start =
          $("#gradStart").value;

        $("#gradStart").value =
          $("#gradEnd").value;

        $("#gradEnd").value =
          start;

        generate();

      };


      $("#randomGradient").onclick = () => {

        const randomColor = () =>
          "#" +
          Math.floor(
            Math.random() * 16777215
          )
            .toString(16)
            .padStart(6, "0");


        $("#gradStart").value =
          randomColor();

        $("#gradEnd").value =
          randomColor();

        generate();

      };


      generate();

    }


    if (id === "minimessage") {

      const generate = () => {

        const value =
          $("#miniInput").value;

        setOut(
          "#miniResult",
          value
        );

        const opening =
          (value.match(/</g) || []).length;

        const closing =
          (value.match(/>/g) || []).length;

        $("#miniStatus").textContent =
          opening === closing
            ? "✓ Basic tag syntax looks balanced."
            : "Unbalanced angle brackets detected.";


        setOut(
          "#miniPreview",
          value
            .replace(
              /<gradient:([^:>]+):([^>]+)>[\s\S]*?<\/gradient>/g,
              (_, start, end) =>
                `Gradient: ${start} → ${end}`
            )
            .replace(
              /<[^>]+>/g,
              ""
            )
        );

      };


      $("#miniInput").oninput =
        generate;


      $$("[data-insert]").forEach(button => {

        button.onclick = () => {

          $("#miniInput").value +=
            button.dataset.insert;

          generate();

        };

      });


      generate();

    }


    if (id === "title") {

      const generate = () => {

        const type =
          $("#msgType").value;

        const target =
          $("#msgTarget").value || "@a";

        const text =
          $("#msgText").value;

        const color =
          $("#msgColor").value ||
          "#FFFFFF";

        let command;


        if (type === "title") {

          command =
            `/title ${target} title {"text":"${text}","color":"${color}"}`;

        } else if (type === "actionbar") {

          command =
            `/title ${target} actionbar {"text":"${text}","color":"${color}"}`;

        } else if (type === "tellraw") {

          command =
            `/tellraw ${target} {"text":"${text}","color":"${color}"}`;

        } else {

          command =
            `/bossbar add astra:message {"text":"${text}","color":"${color}"}`;

        }


        setOut(
          "#commandOut",
          command
        );

      };


      $$("#toolContent input, #toolContent select")
        .forEach(element => {

          element.oninput =
            generate;

        });


      generate();

    }


    if (id === "motd") {

      const generate = () => {

        const first =
          $("#motd1").value;

        const second =
          $("#motd2").value;

        setOut(
          "#motdOut",
          `motd=${first}\\n${second}`
        );

        setOut(
          "#motdMini",
          `${first}\n${second}`
        );

      };


      $("#motd1").oninput =
        generate;

      $("#motd2").oninput =
        generate;

      generate();

    }


    if (id === "gui") {

      let filled = new Set();


      const outputYaml = () => {

        const title =
          $("#guiTitle").value ||
          "&8Menu";

        const size =
          Number($("#guiRows").value) *
          9;

        const items =
          [...filled]
            .map(slot => `
  slot_${slot}:
    material: DIAMOND
    slot: ${slot}
    display_name: "&bAstra Item"
`)
            .join("");


        setOut(
          "#guiOut",
`menu_title: "${title}"
size: ${size}
open_command: menu
items:
${items || "  # Click a slot to add an item."}`
        );

      };


      const renderSlots = () => {

        const total =
          Number($("#guiRows").value) *
          9;

        $("#slotGrid").innerHTML =
          Array.from(
            { length: total },
            (_, index) => `
              <button
                class="slot ${filled.has(index) ? "filled" : ""}"
                data-slot="${index}"
              >
                ${filled.has(index) ? "◆" : index}
              </button>
            `
          )
          .join("");


        $$("[data-slot]").forEach(button => {

          button.onclick = () => {

            const slot =
              Number(button.dataset.slot);

            if (filled.has(slot)) {

              filled.delete(slot);

            } else {

              filled.add(slot);

            }

            renderSlots();
            outputYaml();

          };

        });

      };


      $("#guiRows").onchange = () => {

        const total =
          Number($("#guiRows").value) *
          9;

        filled =
          new Set(
            [...filled]
              .filter(slot => slot < total)
          );

        renderSlots();
        outputYaml();

      };


      $("#guiTitle").oninput =
        outputYaml;


      renderSlots();
      outputYaml();

    }


    if (id === "model") {

      const generate = () => {

        const name =
          $("#modelName").value ||
          "item";

        const texture =
          $("#texturePath").value ||
          "namespace:item/item";

        const customModelData =
          Number($("#cmd").value) || 1;


        setOut(
          "#modelOut",
          JSON.stringify(
            {
              parent:
                "minecraft:item/generated",

              textures: {
                layer0: texture
              },

              overrides: [
                {
                  predicate: {
                    custom_model_data:
                      customModelData
                  },

                  model:
                    `item/${name}`
                }
              ]
            },
            null,
            2
          )
        );

      };


      $$("#toolContent input")
        .forEach(input => {

          input.oninput =
            generate;

        });


      generate();

    }


    if (id === "fontjson") {

      const generate = () => {

        const data = {

          providers: [

            {
              type: "bitmap",

              file:
                $("#fontTexture").value,

              ascent:
                Number(
                  $("#fontAscent").value
                ),

              height:
                Number(
                  $("#fontHeight").value
                ),

              chars: [
                $("#fontChar").value ||
                "✦"
              ]
            }

          ]

        };


        setOut(
          "#fontOut",
          JSON.stringify(
            data,
            null,
            2
          )
        );

      };


      $$("#toolContent input")
        .forEach(input => {

          input.oninput =
            generate;

        });


      generate();

    }


    if (id === "plugin") {

      const generate = () => {

        setOut(
          "#pluginOut",
`name: ${$("#pluginName").value}
version: ${$("#pluginVersion").value}
main: ${$("#pluginMain").value}
api-version: '${$("#pluginApi").value}'
author: AstraUtilities
description: Generated with AstraUtilities`
        );

      };


      $$("#toolContent input")
        .forEach(input => {

          input.oninput =
            generate;

        });


      generate();

    }


    if (id === "json") {

      const generate = mode => {

        try {

          const object =
            JSON.parse(
              $("#jsonInput").value
            );

          setOut(
            "#jsonOut",
            JSON.stringify(
              object,
              null,
              mode === "minify"
                ? 0
                : 2
            )
          );

          $("#jsonStatus").textContent =
            "✓ Valid JSON.";

        } catch (error) {

          $("#jsonStatus").textContent =
            "Invalid JSON: " +
            error.message;

          setOut(
            "#jsonOut",
            ""
          );

        }

      };


      $("#formatJson").onclick =
        () => generate("pretty");

      $("#minifyJson").onclick =
        () => generate("minify");

      $("#jsonInput").oninput =
        () => generate("pretty");

      generate("pretty");

    }


    if (id === "yaml") {

      const generate = () => {

        const text =
          $("#yamlInput")
            .value
            .replace(/\t/g, "  ")
            .split("\n")
            .map(line =>
              line.replace(/\s+$/, "")
            )
            .join("\n");


        setOut(
          "#yamlOut",
          text
        );


        $("#yamlStatus").textContent =
          /^\s*[^#\s][^:]*:/m.test(text)
            ? "✓ YAML-style keys detected. Indentation normalized."
            : "Add at least one key followed by a colon.";

      };


      $("#formatYaml").onclick =
        generate;

      $("#yamlInput").oninput =
        generate;

      generate();

    }


    if (id === "command") {

      const generate = () => {

        const type =
          $("#commandType").value;

        const target =
          $("#cmdTarget").value ||
          "@p";

        const value =
          $("#cmdValue").value || "";


        let command;


        if (type === "give") {

          command =
            `/give ${target} ${value}`;

        } else if (type === "tellraw") {

          command =
            `/tellraw ${target} {"text":"${value}","color":"aqua"}`;

        } else {

          command =
            `/playsound ${value} master ${target} ~ ~ ~ 1 1`;

        }


        setOut(
          "#builderOut",
          command
        );

      };


      $$("#toolContent input, #toolContent select")
        .forEach(element => {

          element.oninput =
            generate;

        });


      generate();

    }

  }


  document.addEventListener(
    "click",
    event => {

      const card =
        event.target.closest(
          "[data-tool]"
        );

      if (
        card &&
        !event.target.closest("[data-fav]")
      ) {

        openTool(
          card.dataset.tool
        );

      }


      const favorite =
        event.target.closest(
          "[data-fav]"
        );

      if (favorite) {

        event.stopPropagation();

        let favorites =
          favs();

        const id =
          favorite.dataset.fav;

        favorites =
          favorites.includes(id)
            ? favorites.filter(
                item => item !== id
              )
            : [...favorites, id];

        saveFavs(favorites);

        renderTools();

      }


      if (
        event.target.closest("[data-close]")
      ) {

        closeAll();

      }


      const category =
        event.target.closest(
          "[data-open-tool]"
        );

      if (category) {

        openTool(
          category.dataset.openTool
        );

      }

    }
  );


  function showSearch(query = "") {

    const modal =
      $("#searchModal");

    modal.classList.add("open");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    const input =
      $("#globalSearch");

    input.value =
      query;


    let selected = 0;


    const render = () => {

      const search =
        input.value
          .toLowerCase()
          .trim();


      const results =
        [...tools]
          .sort((a, b) => {

            const ar =
              recent().indexOf(a.id);

            const br =
              recent().indexOf(b.id);

            return (
              (ar < 0 ? 999 : ar) -
              (br < 0 ? 999 : br)
            );

          })
          .filter(tool =>
            !search ||
            `${tool.name} ${tool.category} ${tool.desc}`
              .toLowerCase()
              .includes(search)
          );


      $("#searchResults").innerHTML =
        results.map((tool, index) => `

          <button
            class="search-result ${index === selected ? "active" : ""}"
            data-result="${tool.id}"
          >

            <span class="result-icon">
              ${tool.icon}
            </span>

            <span>

              <b>${tool.name}</b>

              <small>
                ${tool.category} · ${tool.desc}
              </small>

            </span>

          </button>

        `).join("") ||
        '<p class="notice">No tools match that search.</p>';


      $$("[data-result]").forEach(button => {

        button.onclick = () => {

          closeAll();

          openTool(
            button.dataset.result
          );

        };

      });

    };


    input.oninput = () => {

      selected = 0;

      render();

    };


    input.onkeydown = event => {

      const count =
        $$("[data-result]").length;


      if (event.key === "ArrowDown") {

        event.preventDefault();

        selected =
          Math.min(
            selected + 1,
            Math.max(0, count - 1)
          );

        render();

      }


      if (event.key === "ArrowUp") {

        event.preventDefault();

        selected =
          Math.max(
            selected - 1,
            0
          );

        render();

      }


      if (
        event.key === "Enter" &&
        count
      ) {

        closeAll();

        openTool(
          $$("[data-result]")[
            selected
          ].dataset.result
        );

      }

    };


    render();


    setTimeout(
      () => input.focus(),
      50
    );

  }


  $("#searchButton").onclick =
    () => showSearch();


  $("#openSearchHero").onclick =
    () => showSearch();


  $("#heroSearch").oninput =
    event => {

      if (
        event.target.value.length > 1
      ) {

        showSearch(
          event.target.value
        );

      }

    };


  $("#showFavorites").onclick =
    () => {

      renderTools(
        tools.filter(tool =>
          favs().includes(tool.id)
        )
      );

    };


  $("#settingsButton").onclick =
    () => {

      $("#settingsModal")
        .classList.add("open");

      $("#settingsModal")
        .setAttribute(
          "aria-hidden",
          "false"
        );

    };


  $("#themeToggle").checked =
    localStorage.getItem(
      "astra-light"
    ) === "1";


  $("#motionToggle").checked =
    localStorage.getItem(
      "astra-motion"
    ) === "1";


  const applySettings = () => {

    document.body.classList.toggle(
      "light",
      $("#themeToggle").checked
    );

    document.body.classList.toggle(
      "reduced-motion",
      $("#motionToggle").checked
    );


    localStorage.setItem(
      "astra-light",
      $("#themeToggle").checked
        ? "1"
        : "0"
    );


    localStorage.setItem(
      "astra-motion",
      $("#motionToggle").checked
        ? "1"
        : "0"
    );

  };


  $("#themeToggle").onchange =
    applySettings;


  $("#motionToggle").onchange =
    applySettings;


  applySettings();


  $("#clearData").onclick = () => {

    if (
      confirm(
        "Clear all AstraUtilities saved settings, favorites, and recents?"
      )
    ) {

      Object.keys(localStorage)
        .filter(key =>
          key.startsWith("astra-")
        )
        .forEach(key =>
          localStorage.removeItem(key)
        );

      location.reload();

    }

  };


  $("#menuButton").onclick =
    () => showSearch();


  document.addEventListener(
    "keydown",
    event => {

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {

        event.preventDefault();

        showSearch();

      }


      if (event.key === "Escape") {

        closeAll();

      }

    }
  );

})();
