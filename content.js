function injectOverlay() {
  if (document.getElementById("watch-overlay")) return;

  // === Main container ===
  const container = document.createElement("div");
  container.id = "watch-container";
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    zIndex: "100000",
  });

  // === Video player panel (80%) ===
  const overlay = document.createElement("div");
  overlay.id = "watch-overlay";
  Object.assign(overlay.style, {
    flex: "0 0 80%",
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  });

  const mediaWrapper = document.createElement("div");
  Object.assign(mediaWrapper.style, {
    flex: "1",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "black",
  });

  const input = document.createElement("input");
  input.placeholder = "Paste video URL here (.mp4, .webm or webpage)";
  Object.assign(input.style, {
    padding: "8px",
    fontSize: "14px",
    border: "none",
    outline: "none",
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const url = input.value.trim();
      mediaWrapper.innerHTML = "";

      if (url.endsWith(".mp4") || url.endsWith(".webm") || url.startsWith("hls:")) {
        const video = document.createElement("video");
        video.src = url.startsWith("hls:") ? url.replace(/^hls:/, "") : url;
        video.controls = true;
        video.autoplay = true;
        Object.assign(video.style, {
          width: "100%",
          height: "100%",
          objectFit: "contain",
        });
        mediaWrapper.appendChild(video);
      } else {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.allow = "autoplay; fullscreen";
        iframe.allowFullscreen = true;
        Object.assign(iframe.style, {
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        });
        mediaWrapper.appendChild(iframe);
      }
    }
  });

  overlay.appendChild(mediaWrapper);
  overlay.appendChild(input);

  // === Chat panel (20%) ===
  const chatContainer = document.querySelector('[class*="chat"]');
  if (!chatContainer) {
    console.warn("Discord chat not found.");
    return;
  }

  // Wrap original chat
  const chatWrapper = document.createElement("div");
  chatWrapper.id = "chat-wrapper";
  chatContainer.parentNode.insertBefore(chatWrapper, chatContainer);
  chatWrapper.appendChild(chatContainer);

  Object.assign(chatWrapper.style, {
    flex: "0 0 20%",
    height: "100%",
    overflowY: "auto",
    backgroundColor: "#2f3136",
    zIndex: "100001",
  });

  Object.assign(chatContainer.style, {
    position: "static",
    height: "100%",
    width: "100%",
    overflowY: "auto",
  });

  container.appendChild(overlay);
  container.appendChild(chatWrapper);
  document.body.appendChild(container);
}

function loadSocketIO(callback) {
  const script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
  script.onload = callback;
  document.head.appendChild(script);
}

loadSocketIO(() => {
  const socket = io("https://funky-spiffy-wisteria.glitch.me"); // change to your server URL

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.display = "flex";
  container.style.zIndex = "100000";
  container.style.background = "black";

  const videoSection = document.createElement("div");
  videoSection.style.flex = "0 0 80%";
  videoSection.style.backgroundColor = "#000";
  videoSection.style.display = "flex";
  videoSection.style.flexDirection = "column";

  const input = document.createElement("input");
  input.placeholder = "Paste video URL";
  Object.assign(input.style, {
    padding: "8px",
    fontSize: "14px",
    border: "none",
    outline: "none",
  });

  const mediaWrapper = document.createElement("div");
  mediaWrapper.style.flex = "1";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const url = input.value.trim();
      socket.emit("urlChange", url); // 🔁 emit
      loadMedia(url);
    }
  });

  function loadMedia(url) {
    mediaWrapper.innerHTML = "";

    if (url.endsWith(".mp4") || url.endsWith(".webm")) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.style.width = "100%";
      video.style.height = "100%";
      videoSection.appendChild(video);
      mediaWrapper.appendChild(video);
    } else {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.allow = "autoplay; fullscreen";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      mediaWrapper.appendChild(iframe);
    }
  }

  // 🔁 receive sync from server
  socket.on("urlChange", (url) => {
    if (url && input.value !== url) {
      input.value = url;
      loadMedia(url);
    }
  });

  videoSection.appendChild(mediaWrapper);
  videoSection.appendChild(input);
  container.appendChild(videoSection);

  // placeholder for Discord chat 20%
  const chat = document.createElement("div");
  chat.style.flex = "0 0 20%";
  chat.style.background = "#2f3136";
  container.appendChild(chat);

  document.body.appendChild(container);
});

// Load Socket.IO client from CDN
function loadSocketIO(callback) {
  const script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
  script.onload = callback;
  document.head.appendChild(script);
}

// Main overlay logic
loadSocketIO(() => {
  const socket = io("https://funky-spiffy-wisteria.glitch.me"); // CHANGE THIS to your Glitch live site

  // Prevent duplicate overlay
  if (document.getElementById("watch-overlay")) return;

  // === Container ===
  const container = document.createElement("div");
  container.id = "watch-overlay";
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    zIndex: "100000",
  });

  // === Video Panel ===
  const videoPanel = document.createElement("div");
  Object.assign(videoPanel.style, {
    flex: "0 0 80%",
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
  });

  const mediaWrapper = document.createElement("div");
  Object.assign(mediaWrapper.style, {
    flex: "1",
    width: "100%",
    height: "100%",
    position: "relative",
  });

  const input = document.createElement("input");
  input.placeholder = "Paste video URL (.mp4, .webm, or iframe link)";
  Object.assign(input.style, {
    padding: "10px",
    fontSize: "14px",
    border: "none",
    outline: "none",
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const url = input.value.trim();
      socket.emit("urlChange", url);
      loadMedia(url);
    }
  });

  function loadMedia(url) {
    mediaWrapper.innerHTML = "";

    if (url.endsWith(".mp4") || url.endsWith(".webm")) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      Object.assign(video.style, {
        width: "100%",
        height: "100%",
        objectFit: "contain",
      });
      mediaWrapper.appendChild(video);
    } else {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.allow = "autoplay; fullscreen";
      iframe.allowFullscreen = true;
      Object.assign(iframe.style, {
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      });
      mediaWrapper.appendChild(iframe);
    }
  }

  socket.on("urlChange", (url) => {
    if (url && input.value.trim() !== url) {
      input.value = url;
      loadMedia(url);
    }
  });

  videoPanel.appendChild(mediaWrapper);
  videoPanel.appendChild(input);

  // === Chat Panel ===
  const chatPanel = document.createElement("div");
  Object.assign(chatPanel.style, {
    flex: "0 0 20%",
    backgroundColor: "#2f3136",
    overflowY: "auto",
  });

  const chatClone = document.querySelector('[class*="chat"]');
  if (chatClone) {
    const clonedChat = chatClone.cloneNode(true);
    clonedChat.style.height = "100%";
    clonedChat.style.width = "100%";
    chatPanel.appendChild(clonedChat);
  } else {
    chatPanel.innerHTML = `<div style="color:white; padding:10px;">Discord chat not found.</div>`;
  }

  // Add to DOM
  container.appendChild(videoPanel);
  container.appendChild(chatPanel);
  document.body.appendChild(container);
});

injectOverlay();
