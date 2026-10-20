export function routeDialogKey({ key, pauseOpen, communityOpen }) {
  if (pauseOpen) return key === "Escape" ? "resume" : "ignore";
  if (communityOpen) return "ignore";
  return "game";
}

export function createPauseController({ dialog, resumeButton, canvas, canResume, setPlaying, clearHeldInput }) {
  let closeIntent = null;

  function restoreGameplay() {
    clearHeldInput();
    const resumable = Boolean(canResume());
    setPlaying(resumable);
    if (resumable) canvas.focus({ preventScroll: true });
    return resumable;
  }

  function pause() {
    if (!canResume()) return false;
    clearHeldInput();
    setPlaying(false);
    closeIntent = null;
    dialog.returnValue = "";
    if (!dialog.open) dialog.showModal();
    resumeButton.focus({ preventScroll: true });
    return true;
  }

  function resume() {
    closeIntent = "resume";
    if (dialog.open) dialog.close("resume");
    else restoreGameplay();
    return true;
  }

  function closeFor(intent) {
    if (intent !== "restart" && intent !== "title") throw new Error(`Unsupported pause close intent: ${intent}`);
    clearHeldInput();
    setPlaying(false);
    if (dialog.open) {
      closeIntent = intent;
      dialog.close(intent);
    } else {
      closeIntent = null;
    }
  }

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    resume();
  });

  dialog.addEventListener("close", () => {
    const intent = dialog.returnValue || closeIntent || "resume";
    closeIntent = null;
    if (intent === "resume") restoreGameplay();
  });

  return Object.freeze({ pause, resume, closeFor });
}
