const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Select a token or assign a user character first.");
} else {
  const profile = {
    archetype: "GeneFunk Profile",
    origin: "Placeholder origin",
    background: "Placeholder background",
    notes: "Replace these placeholders with table-approved, non-copyrighted notes."
  };

  await Genefunk2090.setActorProfile(actor, profile);
}
