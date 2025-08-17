import { ItemStack, system, world, Dimension, Entity } from "@minecraft/server";

world.afterEvents.entityHurt.subscribe((e) => {
    const { hurtEntity } = e;
    if (hurtEntity.typeId == "minecraft:chicken" || hurtEntity.typeId == "raa:male_duck" || hurtEntity.typeId == "raa:duck_female") {
        system.run(() => {
            hurtEntity.dimension.spawnParticle("raa:feather_particle", hurtEntity.location)
        })
    }
})
world.afterEvents.entitySpawn.subscribe(ev => {
    const e = ev.entity;
    if (e.typeId !== "minecraft:item") return;
    let item;
    try {
        item = e.getComponent("item")?.itemStack;
    } catch { return; }
    if (item && item.typeId === "minecraft:egg") {
        let players;
        try {
            players = e.dimension.getEntities({
                type: "minecraft:player",
                location: e.location,
                maxDistance: 2
            });
        } catch { return; }
        if (players.length) {
            const player = players.find(
                p => p.getRotation().x === e.getRotation().x &&
                    p.getRotation().y === e.getRotation().y
            );
            if (player) {
                try {
                    const eggEntity = e.dimension.spawnEntity("raa:egg", e.location);
                    const dir = player.getViewDirection();
                    eggEntity.applyImpulse({ x: dir.x * 0.3, y: dir.y * 0.3, z: dir.z * 0.3 });
                    e.remove();
                } catch { }
                return;
            }
        }
        try {
            e.dimension.spawnEntity("raa:egg", e.location);
            e.remove();
        } catch { }
    }
});
world.afterEvents.entityHitEntity.subscribe(ev => {
    const { hitEntity, damagingEntity } = ev;
    if (hitEntity.typeId !== "raa:egg" || damagingEntity.typeId !== "minecraft:player") return;
    try {
        hitEntity.remove();
        const inv = damagingEntity.getComponent("inventory")?.container;
        if (inv) inv.addItem(new ItemStack("minecraft:egg", 1));
    } catch { }
});