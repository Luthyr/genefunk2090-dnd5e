export const FIREARM_CATEGORY = "modern-weapon";

export function isFirearm(item, moduleId) {
  return item?.getFlag(moduleId, "category") === FIREARM_CATEGORY;
}

export function getAmmoState(item, moduleId) {
  const firearm = item?.getFlag(moduleId, "firearm") ?? {};
  const legacyAmmo = item?.getFlag(moduleId, "ammo") ?? {};
  const current = Number(foundry.utils.getProperty(item, "system.uses.value") ?? 0);
  const usesMax = Number(foundry.utils.getProperty(item, "system.uses.max") ?? 0);
  const magazineCapacity = Number(firearm.magazineCapacity ?? legacyAmmo.magazineSize ?? usesMax ?? current ?? 0);
  const reserve = Number(firearm.reserveAmmo ?? legacyAmmo.reserve ?? 0);
  const burstSize = Number(firearm.burstSize ?? 3);

  return {
    current: Number.isFinite(current) ? current : 0,
    magazineCapacity: Number.isFinite(magazineCapacity) ? magazineCapacity : 0,
    reserve: Number.isFinite(reserve) ? reserve : 0,
    burstEnabled: Boolean(firearm.burstEnabled),
    burstSize: Number.isFinite(burstSize) ? burstSize : 3,
    reloadAction: String(firearm.reloadAction ?? legacyAmmo.reload ?? "action"),
    traits: Array.isArray(firearm.traits) ? firearm.traits : [],
    firearm
  };
}

export async function spendAmmo(item, moduleId, rounds = null) {
  if (!item) throw new Error("No item provided.");

  const state = getAmmoState(item, moduleId);
  const cost = Math.max(Number(rounds ?? (state.burstEnabled ? state.burstSize : 1)), 1);

  if (state.current >= cost) {
    const nextCurrent = state.current - cost;
    await item.update({ "system.uses.value": nextCurrent });
    ui.notifications?.info(`${item.name} magazine: ${nextCurrent}/${state.magazineCapacity}`);
    return nextCurrent;
  }

  ui.notifications?.warn(`${item.name} needs ${cost} ammo, but only has ${state.current} loaded.`);
  return state.current;
}

export async function reloadAmmo(item, moduleId) {
  if (!item) throw new Error("No item provided.");

  const state = getAmmoState(item, moduleId);
  const needed = Math.max(state.magazineCapacity - state.current, 0);
  const loaded = Math.min(needed, state.reserve);

  if (!loaded) {
    ui.notifications?.warn(`${item.name} cannot reload.`);
    return state;
  }

  const nextCurrent = state.current + loaded;
  const nextReserve = state.reserve - loaded;
  await item.update({ "system.uses.value": nextCurrent });
  await item.setFlag(moduleId, "firearm", {
    ...state.firearm,
    magazineCapacity: state.magazineCapacity,
    reserveAmmo: nextReserve,
    reloadAction: state.reloadAction,
    burstSize: state.burstSize,
    burstEnabled: state.burstEnabled,
    traits: state.traits
  });

  ui.notifications?.info(`${item.name} reloaded: ${nextCurrent}/${state.magazineCapacity}, reserve ${nextReserve}.`);
  return getAmmoState(item, moduleId);
}

export async function setBurstFire(item, moduleId, enabled) {
  if (!item) throw new Error("No item provided.");

  const state = getAmmoState(item, moduleId);
  await item.setFlag(moduleId, "firearm", {
    ...state.firearm,
    magazineCapacity: state.magazineCapacity,
    reserveAmmo: state.reserve,
    reloadAction: state.reloadAction,
    burstSize: state.burstSize,
    burstEnabled: Boolean(enabled),
    traits: state.traits
  });

  ui.notifications?.info(`${item.name} burst fire ${enabled ? "enabled" : "disabled"}.`);
  return getAmmoState(item, moduleId);
}

export function getActorFirearms(actor, moduleId) {
  return actor?.items?.contents?.filter((item) => isFirearm(item, moduleId)) ?? [];
}

export function renderFirearmControls(item, moduleId) {
  const state = getAmmoState(item, moduleId);
  const wrapper = document.createElement("div");
  wrapper.className = "genefunk-firearm-controls";

  const status = document.createElement("span");
  status.className = "genefunk-ammo-status";
  status.textContent = `Magazine ${state.current}/${state.magazineCapacity}, reserve ${state.reserve}`;

  const traits = document.createElement("span");
  traits.className = "genefunk-firearm-traits";
  traits.textContent = state.traits.length ? `Traits: ${state.traits.join(", ")}` : "Traits: none";

  const spendButton = document.createElement("button");
  spendButton.type = "button";
  spendButton.textContent = state.burstEnabled ? `Fire Burst (${state.burstSize})` : "Spend Ammo";
  spendButton.addEventListener("click", () => spendAmmo(item, moduleId));

  const reloadButton = document.createElement("button");
  reloadButton.type = "button";
  reloadButton.textContent = `Reload (${state.reloadAction})`;
  reloadButton.addEventListener("click", () => reloadAmmo(item, moduleId));

  const burstLabel = document.createElement("label");
  burstLabel.className = "genefunk-burst-toggle";
  burstLabel.innerHTML = `<input type="checkbox" ${state.burstEnabled ? "checked" : ""}> Burst`;
  burstLabel.querySelector("input").addEventListener("change", (event) => {
    setBurstFire(item, moduleId, event.currentTarget.checked);
  });

  wrapper.append(status, traits, spendButton, reloadButton, burstLabel);
  return wrapper;
}

export function renderActorAmmoPanel(actor, moduleId) {
  const firearms = getActorFirearms(actor, moduleId);
  if (!firearms.length) return null;

  const panel = document.createElement("section");
  panel.className = "genefunk-ammo-panel";
  panel.innerHTML = "<header><strong>Firearms</strong><span>Ammo</span></header>";

  const list = document.createElement("ul");
  for (const item of firearms) {
    const state = getAmmoState(item, moduleId);
    const row = document.createElement("li");
    row.innerHTML = `
      <span>${escapeHtml(item.name)}</span>
      <strong>${state.current}/${state.magazineCapacity}</strong>
      <span>Reserve ${state.reserve}</span>
      <span>${state.burstEnabled ? `Burst ${state.burstSize}` : "Single"}</span>
    `;

    const controls = document.createElement("span");
    controls.className = "genefunk-ammo-row-controls";

    const spendButton = document.createElement("button");
    spendButton.type = "button";
    spendButton.textContent = state.burstEnabled ? `Fire ${state.burstSize}` : "Spend";
    spendButton.addEventListener("click", () => spendAmmo(item, moduleId));

    const reloadButton = document.createElement("button");
    reloadButton.type = "button";
    reloadButton.textContent = "Reload";
    reloadButton.addEventListener("click", () => reloadAmmo(item, moduleId));

    const burstLabel = document.createElement("label");
    burstLabel.className = "genefunk-burst-toggle";
    burstLabel.innerHTML = `<input type="checkbox" ${state.burstEnabled ? "checked" : ""}> Burst`;
    burstLabel.querySelector("input").addEventListener("change", (event) => {
      setBurstFire(item, moduleId, event.currentTarget.checked);
    });

    controls.append(spendButton, reloadButton, burstLabel);
    row.append(controls);
    list.append(row);
  }

  panel.append(list);
  return panel;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
