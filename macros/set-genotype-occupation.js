const actor = GeneFunk2090.getSelectedActor();

if (!actor) {
  ui.notifications.warn("Select a token or assign a user character first.");
} else {
  const profile = await Dialog.prompt({
    title: "Set GeneFunk Genotype and Occupation",
    content: `
      <form>
        <div class="form-group">
          <label>Genotype</label>
          <input type="text" name="genotype" value="Placeholder Genotype">
        </div>
        <div class="form-group">
          <label>Occupation</label>
          <input type="text" name="occupation" value="Placeholder Occupation">
        </div>
      </form>
    `,
    label: "Set Profile",
    callback: (html) => {
      const root = html instanceof HTMLElement ? html : html[0];
      const data = new FormData(root.querySelector("form"));
      return {
        genotype: data.get("genotype"),
        occupation: data.get("occupation"),
        notes: "Placeholder profile. Replace with table-approved notes."
      };
    }
  });

  if (profile) await GeneFunk2090.setProfile(actor, profile);
}
