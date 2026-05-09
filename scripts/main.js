/**
 * GeneFunk 2090 for D&D 5e
 * MVP module scaffold.
 *
 * Design principle:
 * - Keep the official dnd5e system as the rules engine.
 * - Store GeneFunk-specific data in actor/item flags.
 * - Use dnd5e item types where possible: class, subclass, feat, weapon, equipment, consumable, spell.
 * - Add automation only where it meaningfully reduces table friction.
 */

const MODULE_ID = "genefunk2090-dnd5e";
const ITEM_CATEGORIES = new Set(["hack", "cyberware", "bioware", "modern-weapon", "armor", "drug", "tool", "equipment"]);

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing`);

  game.settings.register(MODULE_ID, "enableModernFirearms", {
    name: game.i18n.localize("GENEFUNK.Settings.EnableModernFirearms.Name"),
    hint: game.i18n.localize("GENEFUNK.Settings.EnableModernFirearms.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "enableHackTracking", {
    name: game.i18n.localize("GENEFUNK.Settings.EnableHackCardTracking.Name"),
    hint: game.i18n.localize("GENEFUNK.Settings.EnableHackCardTracking.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "showSheetBadges", {
    name: game.i18n.localize("GENEFUNK.Settings.EnableSheetBadges.Name"),
    hint: game.i18n.localize("GENEFUNK.Settings.EnableSheetBadges.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
  if (game.system.id !== "dnd5e") {
    ui.notifications.warn("GeneFunk 2090 for D&D 5e is designed for the dnd5e system.");
  }

  globalThis.GeneFunk2090 = createHelpers();
  globalThis.Genefunk2090 = globalThis.GeneFunk2090;
});

/**
 * Add a small metadata header to dnd5e character sheets.
 * This avoids replacing the full dnd5e sheet, which keeps compatibility higher.
 */
Hooks.on("renderActorSheet", (app, html) => {
  injectActorBadge(app, html);
  injectActorPanel(app, html);
});

Hooks.on("renderActorSheetV2", (app, element) => {
  injectActorBadge(app, element);
  injectActorPanel(app, element);
});

Hooks.on("renderItemSheet", (app, html) => {
  injectItemNote(app, html);
});

Hooks.on("renderItemSheetV2", (app, element) => {
  injectItemNote(app, element);
});

function injectActorBadge(app, html) {
  if (!game.settings.get(MODULE_ID, "showSheetBadges")) return;

  const actor = app.actor ?? app.document;
  if (actor?.type !== "character") return;

  const root = getRootElement(html);
  if (!root || root.querySelector(".genefunk-sheet-badge")) return;

  const gf = actor.getFlag(MODULE_ID, "profile") ?? {};
  const primary = gf.genotype || gf.archetype || "Unassigned Genotype";
  const secondary = gf.occupation || gf.origin || "Unassigned Occupation";

  const badge = document.createElement("div");
  badge.classList.add("genefunk-sheet-badge");
  badge.innerHTML = `
    <strong>GeneFunk 2090</strong>
    <span>${escapeHtml(primary)}</span>
    <span>${escapeHtml(secondary)}</span>
  `;

  const target = root.querySelector(".window-content form") || root.querySelector(".window-content") || root.querySelector("form") || root;
  if (target) target.prepend(badge);
}

function injectActorPanel(app, html) {
  if (!game.settings.get(MODULE_ID, "showSheetBadges")) return;

  const actor = app.actor ?? app.document;
  if (!actor || !["character", "npc"].includes(actor.type)) return;

  const root = getRootElement(html);
  if (!root || root.querySelector(".genefunk-actor-panel")) return;

  const profile = getProfile(actor);
  const panel = document.createElement("section");
  panel.className = "genefunk-actor-panel";
  panel.innerHTML = `
    <header>
      <strong>GeneFunk</strong>
      <span>Profile</span>
    </header>
    <div class="genefunk-profile-grid">
      <label>Genotype <input type="text" name="genotype" value="${escapeAttribute(profile.genotype || "")}"></label>
      <label>Occupation <input type="text" name="occupation" value="${escapeAttribute(profile.occupation || "")}"></label>
      <label>Faction <input type="text" name="faction" value="${escapeAttribute(profile.faction || "")}"></label>
      <label>Credits <input type="number" name="credits" value="${Number(profile.credits || 0)}"></label>
      <label>Cyberware Load <input type="number" name="cyberwareLoad" value="${Number(getCyberwareLoad(actor, profile))}"></label>
    </div>
  `;

  panel.addEventListener("change", async (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;

    const next = {
      ...getProfile(actor),
      [input.name]: input.type === "number" ? Number(input.value || 0) : input.value
    };
    await setProfile(actor, next);
  });

  const target = root.querySelector(".window-content form") || root.querySelector(".window-content") || root.querySelector("form") || root;
  target.prepend(panel);
}

/**
 * Adds a lightweight item sheet note for GeneFunk-tagged items.
 */
function injectItemNote(app, html) {
  const item = app.item ?? app.document;
  const category = item?.getFlag(MODULE_ID, "category");
  if (!category) return;

  const root = getRootElement(html);
  if (!root || root.querySelector(".genefunk-item-note")) return;

  const note = document.createElement("div");
  note.classList.add("genefunk-item-note");
  note.innerHTML = `<strong>GeneFunk Category:</strong> ${escapeHtml(category)}`;

  if (category === "modern-weapon") {
    const state = getAmmoState(item);
    const status = document.createElement("span");
    status.className = "genefunk-ammo-status";
    status.textContent = ` Magazine ${state.current}/${state.magazineSize}, reserve ${state.reserve}`;

    const spendButton = document.createElement("button");
    spendButton.type = "button";
    spendButton.textContent = "Spend Ammo";
    spendButton.addEventListener("click", () => spendAmmo(item));

    const reloadButton = document.createElement("button");
    reloadButton.type = "button";
    reloadButton.textContent = "Reload";
    reloadButton.addEventListener("click", () => reloadAmmo(item));

    note.append(status, spendButton, reloadButton);
  }

  const target = root.querySelector(".window-content form") || root.querySelector(".window-content") || root.querySelector("form") || root;
  if (target) target.prepend(note);
}

/**
 * Public helper functions for macros and later automation.
 */
function createHelpers() {
  return {
    MODULE_ID,
    ITEM_CATEGORIES: [...ITEM_CATEGORIES],
    getSelectedActor,
    getProfile,
    getActorProfile: getProfile,
    setProfile,
    setActorProfile: setProfile,
    tagItem,
    printActorProfileToChat,
    importStarterContent,
    importStarterActors,
    getAmmoState,
    spendAmmo,
    reloadAmmo
  };
}

function getSelectedActor() {
  return canvas?.tokens?.controlled?.[0]?.actor ?? game.user?.character ?? null;
}

async function setProfile(actorOrProfile, maybeProfile) {
  const actor = maybeProfile ? actorOrProfile : getSelectedActor();
  const profile = maybeProfile ?? actorOrProfile;
  if (!actor) throw new Error("No actor provided.");

  const normalized = normalizeProfile(profile);
  await actor.setFlag(MODULE_ID, "profile", normalized);
  ui.notifications?.info(`GeneFunk profile set for ${actor.name}.`);
  return normalized;
}

function getProfile(actor = getSelectedActor()) {
  return actor?.getFlag(MODULE_ID, "profile") ?? {};
}

async function tagItem(item, category = "equipment") {
  if (!item) throw new Error("No item provided.");

  const normalized = String(category).trim().toLowerCase();
  if (!ITEM_CATEGORIES.has(normalized)) {
    throw new Error(`Unsupported GeneFunk item category: ${category}`);
  }

  await item.setFlag(MODULE_ID, "category", normalized);
  ui.notifications?.info(`${item.name} tagged as ${normalized}.`);
  return normalized;
}

async function spendAmmo(item) {
  if (!item) throw new Error("No item provided.");

  const state = getAmmoState(item);
  if (state.current > 0) {
    const nextCurrent = state.current - 1;
    await item.update({ "system.uses.value": nextCurrent });
    ui.notifications?.info(`${item.name} magazine: ${nextCurrent}/${state.magazineSize}`);
    return nextCurrent;
  }

  const quantity = Number(foundry.utils.getProperty(item, "system.quantity"));
  if (Number.isFinite(quantity) && quantity > 0) {
    await item.update({ "system.quantity": quantity - 1 });
    ui.notifications?.info(`${item.name} quantity: ${quantity - 1}`);
    return quantity - 1;
  }

  ui.notifications?.warn(`${item.name} has no ammo or quantity remaining.`);
  return 0;
}

async function reloadAmmo(item) {
  if (!item) throw new Error("No item provided.");

  const state = getAmmoState(item);
  const needed = Math.max(state.magazineSize - state.current, 0);
  const loaded = Math.min(needed, state.reserve);

  if (!loaded) {
    ui.notifications?.warn(`${item.name} cannot reload.`);
    return state;
  }

  const nextCurrent = state.current + loaded;
  const nextReserve = state.reserve - loaded;
  await item.update({ "system.uses.value": nextCurrent });
  await item.setFlag(MODULE_ID, "ammo", {
    ...state.flag,
    magazineSize: state.magazineSize,
    reserve: nextReserve
  });

  ui.notifications?.info(`${item.name} reloaded: ${nextCurrent}/${state.magazineSize}, reserve ${nextReserve}.`);
  return getAmmoState(item);
}

function getAmmoState(item) {
  const flag = item?.getFlag(MODULE_ID, "ammo") ?? {};
  const current = Number(foundry.utils.getProperty(item, "system.uses.value") ?? 0);
  const usesMax = Number(foundry.utils.getProperty(item, "system.uses.max") ?? 0);
  const magazineSize = Number(flag.magazineSize ?? usesMax ?? current ?? 0);
  const reserve = Number(flag.reserve ?? 0);

  return {
    current: Number.isFinite(current) ? current : 0,
    magazineSize: Number.isFinite(magazineSize) ? magazineSize : 0,
    reserve: Number.isFinite(reserve) ? reserve : 0,
    flag
  };
}

async function importStarterContent() {
  const items = await loadStarterItems();
  const existingNames = new Set(game.items.contents.map((item) => item.name));
  const toCreate = items.filter((item) => !existingNames.has(item.name));

  if (!toCreate.length) {
    ui.notifications?.info("GeneFunk starter content already exists in this world.");
    return [];
  }

  const created = await Item.createDocuments(toCreate);
  ui.notifications?.info(`Created ${created.length} GeneFunk starter items.`);
  return created;
}

async function importStarterActors() {
  const actors = await loadStarterActors();
  const existingNames = new Set(game.actors.contents.map((actor) => actor.name));
  const toCreate = actors.filter((actor) => !existingNames.has(actor.name));

  if (!toCreate.length) {
    ui.notifications?.info("GeneFunk starter actors already exist in this world.");
    return [];
  }

  const created = await Actor.createDocuments(toCreate);
  ui.notifications?.info(`Created ${created.length} GeneFunk starter actors.`);
  return created;
}

async function loadStarterItems() {
  const response = await fetch(`modules/${MODULE_ID}/source-import/starter-items.json`);
  if (!response.ok) throw new Error(`Unable to load starter content: ${response.status}`);
  return response.json();
}

async function loadStarterActors() {
  const response = await fetch(`modules/${MODULE_ID}/source-import/starter-actors.json`);
  if (!response.ok) throw new Error(`Unable to load starter actors: ${response.status}`);
  return response.json();
}

async function printActorProfileToChat(actor = getSelectedActor()) {
  if (!actor) throw new Error("No actor provided.");

  const profile = getProfile(actor);
  const rows = Object.entries(profile).length
    ? Object.entries(profile).map(([key, value]) => `<dt>${escapeHtml(labelize(key))}</dt><dd>${escapeHtml(String(value || "Not set"))}</dd>`).join("")
    : "<dt>Status</dt><dd>No GeneFunk profile flag set.</dd>";

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <section class="genefunk-chat-profile">
        <h3>${escapeHtml(actor.name)} GeneFunk Profile</h3>
        <dl>${rows}</dl>
      </section>
    `
  });
}

function normalizeProfile(profile = {}) {
  if (typeof profile === "string") {
    return { archetype: profile, origin: "", background: "", notes: "" };
  }

  return {
    genotype: String(profile.genotype ?? profile.archetype ?? ""),
    occupation: String(profile.occupation ?? profile.origin ?? ""),
    faction: String(profile.faction ?? ""),
    credits: Number(profile.credits ?? 0),
    cyberwareLoad: Number(profile.cyberwareLoad ?? 0),
    archetype: String(profile.archetype ?? profile.genotype ?? ""),
    origin: String(profile.origin ?? profile.occupation ?? ""),
    background: String(profile.background ?? profile.faction ?? ""),
    notes: String(profile.notes ?? "")
  };
}

function getCyberwareLoad(actor, profile = getProfile(actor)) {
  if (Number(profile.cyberwareLoad)) return Number(profile.cyberwareLoad);
  return actor.items?.contents?.filter((item) => item.getFlag(MODULE_ID, "category") === "cyberware").length ?? 0;
}

function labelize(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function getRootElement(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function escapeAttribute(value) {
  return escapeHtml(String(value)).replace(/"/g, "&quot;");
}
