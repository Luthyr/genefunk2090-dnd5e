const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Select a token or assign a user character first.");
} else {
  const item = actor.items.find((candidate) => candidate.sheet?.rendered) ?? actor.items.contents[0];

  if (!item) {
    ui.notifications.warn(`${actor.name} has no items to tag.`);
  } else {
    const category = await Dialog.prompt({
      title: "Tag GeneFunk Item",
      content: `
        <form>
          <div class="form-group">
            <label>Category</label>
            <select name="category">
              <option value="cyberware">Cyberware</option>
              <option value="bioware">Bioware</option>
              <option value="hack">Hack</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
        </form>
      `,
      label: "Tag Item",
      callback: (html) => {
        const root = html instanceof HTMLElement ? html : html[0];
        return new FormData(root.querySelector("form")).get("category");
      }
    });

    if (category) await Genefunk2090.tagItem(item, category);
  }
}
