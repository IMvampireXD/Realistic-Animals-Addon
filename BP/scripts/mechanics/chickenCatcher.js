import { EntityComponentTypes, system, world } from '@minecraft/server';

// Implements the player ability to catch chickens in Realistic Animals Add-On.

const chickenType = 'minecraft:chicken';
const mobCatcherType = 'raa:mob_catcher';
const playerCatchEvent = 'raa:player_on_catch_mob';
const playerReleaseEvent = 'raa:player_on_release_mob';

world.afterEvents.playerInteractWithEntity.subscribe(({ player, target, itemStack }) => {
  if (target.typeId !== chickenType || itemStack) return;

  const ridingOn = target.getComponent(EntityComponentTypes.Riding)?.entityRidingOn;
  if (ridingOn?.typeId === mobCatcherType && ridingOn.getComponent(EntityComponentTypes.Riding)?.entityRidingOn === player) {
    player.triggerEvent(playerReleaseEvent);
    return;
  }

  player.triggerEvent(playerCatchEvent);
  system.runTimeout(() => {
    if (!target.isValid || !player.isValid) return;
    target.clearVelocity();

    const rideable = player.getComponent(EntityComponentTypes.Rideable);
    const riders = rideable.getRiders();

    const { dimension, location } = player;
    const mobCatcher = dimension.spawnEntity(mobCatcherType, location);
    mobCatcher.getComponent(EntityComponentTypes.Rideable)?.addRider(target);

    // Forces the catcher to be on first seat
    rideable.ejectRiders();
    rideable.addRider(mobCatcher);
    const total = riders.length;
    for (let i = 0; i < total; i++) rideable.addRider(riders[i]);
  }, 2);
});

const playerType = 'minecraft:player';

world.afterEvents.entityHitEntity.subscribe(({ hitEntity, damagingEntity: player }) => {
  if (hitEntity.typeId !== chickenType) return;

  const ridingOn = hitEntity.getComponent(EntityComponentTypes.Riding)?.entityRidingOn;
  if (ridingOn?.typeId !== mobCatcherType || ridingOn.getComponent(EntityComponentTypes.Riding)?.entityRidingOn !== player) return;

  player.triggerEvent(playerReleaseEvent);
}, { entityTypes: [playerType] } );

world.afterEvents.dataDrivenEntityTrigger.subscribe(({ entity: player }) => {
  const rideable = player.getComponent(EntityComponentTypes.Rideable);
  if (!rideable) return;

  const firstRider = rideable.getRiders()[0];
  if (firstRider?.typeId !== mobCatcherType) return;
  rideable.ejectRider(firstRider);
}, {
  entityTypes: [playerType],
  eventTypes: [playerReleaseEvent]
});


/*
 * 🦊 Ideas crafted into code by <@JeanLucasMCPE> — 2025
 * 💬 Questions or feedback? Ping me anytime! 🚀
 * ------------------------------------------
 */