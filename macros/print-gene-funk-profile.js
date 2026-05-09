const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Select a token or assign a user character first.");
} else {
  await Genefunk2090.printActorProfileToChat(actor);
}
