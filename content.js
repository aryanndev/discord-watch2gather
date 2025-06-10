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

injectOverlay();
