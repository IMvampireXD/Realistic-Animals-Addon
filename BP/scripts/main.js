import { ItemStack, system, world, GameMode, EntityComponentTypes } from "@minecraft/server";

import "./mechanics/chickenCatcher.js";

import { BlockComponents } from "./registry/BlockComponents.js";
BlockComponents.register();

const eggSpawnEvents = {
    "minecraft:egg": "",
    "minecraft:blue_egg": "raa:blue_egg",
    "minecraft:brown_egg": "raa:brown_egg"
};
const eggItemTypes = Object.keys(eggSpawnEvents);

world.afterEvents.entityHurt.subscribe((e) => {
    const { hurtEntity } = e;
    system.run(() => {
        hurtEntity.dimension.spawnParticle("raa:feather_particle", hurtEntity.location)
    })
}, {
    entityTypes: [
        "minecraft:chicken",
        "raa:male_duck",
        "raa:duck_female"
    ]
});
world.afterEvents.entitySpawn.subscribe(ev => {
    const e = ev.entity;
    if (e.typeId !== "minecraft:item") return;
    let item;
    try {
        item = e.getComponent("item")?.itemStack;
    } catch { return; }
    if (!item) return;
    const spawnEvent = eggSpawnEvents[item.typeId];
    if (spawnEvent === undefined) return;
    try {
        e.dimension.spawnEntity("raa:egg", e.location, spawnEvent ? { spawnEvent } : undefined).applyImpulse(e.getVelocity());
        e.remove();
    } catch { }
});
world.afterEvents.entityHitEntity.subscribe(ev => {
    const { hitEntity, damagingEntity } = ev;
    if (hitEntity.typeId !== "raa:egg") return;
    try {
        const eggType = eggItemTypes[hitEntity.getComponent(EntityComponentTypes.MarkVariant)?.value ?? 0];
        const inv = damagingEntity.getComponent("inventory")?.container;
        if (!inv || inv.addItem(new ItemStack(eggType, 1)) && damagingEntity.getGameMode() !== GameMode.Creative) return;
        hitEntity.remove();
        damagingEntity.dimension.playSound("random.pop", damagingEntity.location, { volume: 0.5, pitch: 1.1 });
    } catch { }
}, { entityTypes: ["minecraft:player"] });
