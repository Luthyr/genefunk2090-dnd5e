const MODULE_ID = "genefunk2090-dnd5e";

const FLAGS = {
  actorProfile: "profile",
  itemCategory: "category"
};

const ITEM_CATEGORIES = new Set(["cyberware", "bioware", "hack", "equipment"]);

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("ready", () => {
  globalThis.Genefunk2090 = {
    MODULE_ID,
    FLAGS,
    ITEM_CATEGORIES: [...ITEM_CATEGORIES],
    getSelectedActor,
    getActorProfile,
    setActorProfile,
    printActorProfileToChat,
    tagItem
  };

  console.info(`${MODULE_ID} | Console helpers available on globalThis.Genefunk2090`);
});

Hooks.on("renderActorSheet", (app, html) => {
  injectActorBadge(app.actor ?? app.document, html);
});

Hooks.on("renderActorSheetV2", (app, element) => {
  injectActorBadge(app.actor ?? app.document, element);
});

function registerSettings() {
  game.settings.register(MODULE_ID, "showSheetBadges", {
    name: "Show GeneFunk sheet badges",
    hint: "Display a compact GeneFunk badge on actor sheets when an actor has a GeneFunk profile flag.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => refreshActorSheets()
  });

  game.settings.register(MODULE_ID, "enableModernFirearms", {
    name: "Enable modern firearms",
    hint: "Enable placeholder module affordances for modern firearm content. This pass does not add automation or copyrighted item text.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, "enableHackTracking", {
    name: "Enable hack tracking",
    hint: "Enable placeholder module affordances for hack-tagged items and future tracking workflows.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
}

function refreshActorSheets() {
  for (const actor of game.actors ?? []) {
    for (const app of Object.values(actor.apps ?? {})) app.render(false);
  }
}

function getSelectedActor() {
  const tokenActor = canvas?.tokens?.controlled?.[0]?.actor;
  if (tokenActor) return tokenActor;
  return game.user?.character ?? null;
}

function getActorProfile(actor = getSelectedActor()) {
  if (!actor) return null;
  return actor.getFlag(MODULE_ID, FLAGS.actorProfile) ?? null;
}

async function setActorProfile(actorOrProfile, maybeProfile) {
  const actor = maybeProfile ? actorOrProfile : getSelectedActor();
  const profile = maybeProfile ?? actorOrProfile;

  if (!actor) {
    ui.notifications?.warn("Select a token or assign a user character first.");
    return null;
  }

  const normalized = normalizeProfile(profile);
  await actor.setFlag(MODULE_ID, FLAGS.actorProfile, normalized);
  ui.notifications?.info(`GeneFunk profile set for ${actor.name}.`);
  return normalized;
}

async function printActorProfileToChat(actor = getSelectedActor()) {
  if (!actor) {
    ui.notifications?.warn("Select a token or assign a user character first.");
    return null;
  }

  const profile = getActorProfile(actor);
  const rows = profile
    ? Object.entries(profile).map(([key, value]) => `<dt>${escapeHtml(labelize(key))}</dt><dd>${escapeHtml(String(value || "Not set"))}</dd>`).join("")
    : `<dt>Status</dt><dd>No GeneFunk profile flag set.</dd>`;

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

async function tagItem(item, category = "equipment") {
  if (!item) {
    ui.notifications?.warn("Pass an Item document to Genefunk2090.tagItem(item, category).");
    return null;
  }

  const normalized = String(category).trim().toLowerCase();
  if (!ITEM_CATEGORIES.has(normalized)) {
    ui.notifications?.warn(`Unsupported GeneFunk item category: ${category}`);
    return null;
  }

  await item.setFlag(MODULE_ID, FLAGS.itemCategory, normalized);
  ui.notifications?.info(`${item.name} tagged as ${normalized}.`);
  return normalized;
}

function injectActorBadge(actor, html) {
  if (!actor || !game.settings.get(MODULE_ID, "showSheetBadges")) return;

  const profile = getActorProfile(actor);
  if (!profile) return;

  const root = getElement(html);
  if (!root || root.querySelector(".genefunk-sheet-badge")) return;

  const badge = document.createElement("span");
  badge.className = "genefunk-sheet-badge";
  badge.textContent = profile.badge || profile.archetype || "GeneFunk";
  badge.title = "GeneFunk 2090 profile flag is set";

  const title = root.querySelector(".window-title, .sheet-header, header.sheet-header, .app-title");
  if (title) title.append(badge);
}

function normalizeProfile(profile = {}) {
  if (typeof profile === "string") {
    return {
      archetype: profile,
      origin: "",
      notes: ""
    };
  }

  return {
    archetype: String(profile.archetype ?? profile.badge ?? "GeneFunk Profile"),
    origin: String(profile.origin ?? ""),
    background: String(profile.background ?? ""),
    notes: String(profile.notes ?? "")
  };
}

function getElement(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.[0] instanceof HTMLElement) return html[0];
  return null;
}

function labelize(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
