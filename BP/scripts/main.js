import { system, world } from "@minecraft/server";

world.afterEvents.entityHurt.subscribe((e) => {
    const { hurtEntity } = e;
    if (hurtEntity.typeId == "minecraft:chicken" || hurtEntity.typeId == "raa:male_duck" || hurtEntity.typeId == "raa:duck_female") {
        system.run(() => {
            hurtEntity.dimension.spawnParticle("raa:feather_particle", hurtEntity.location)
        })
    }
})