const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Select a token or assign a user character first.");
} else {
  const profile = {
    genotype: "Placeholder Genotype",
    occupation: "Placeholder Occupation",
    archetype: "Legacy Placeholder Archetype",
    origin: "Legacy Placeholder Origin",
    background: "Placeholder background",
    notes: "Replace these placeholders with table-approved, non-copyrighted notes."
  };

  await GeneFunk2090.setActorProfile(actor, profile);
}
