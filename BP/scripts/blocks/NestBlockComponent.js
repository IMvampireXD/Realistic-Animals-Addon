import { Block, BlockComponentPlayerInteractEvent, BlockComponentPlayerPlaceBeforeEvent, Dimension, Entity, EntityComponentTypes } from '@minecraft/server';
import { getCaughtChicken, releaseCaughtChicken } from '../mechanics/chickenCatcher.js';

/**
 * Realistic Animals Nest block component.
 * @implements {import('@minecraft/server').BlockCustomComponent}
 */
export class NestBlockComponent {
  static COMPONENT_ID = 'raa:nest';
  static #ROTATION_STATE = 'raa:rotation';
  static #SEAT_ENTITY = 'raa:nest_seat';

  /**
   * Converts a player's yaw (in degrees) into an 8-state facing rotation, rounded to the nearest 45°.
   * @param {number} yaw Player yaw in degrees [-180, 180].
   * @returns {number} Integer in 0..7 representing the facing rotation.
   */
  static #getFacingRotation(yaw) {
    // normalize yaw to [0, 360)
    const norm = ((yaw % 360) + 360) % 360;
    // add half step (22.5) so Math.floor rounds to the nearest 45°
    const index = Math.floor((norm + 22.5) / 45) % 8;
    return index; // 0..7
  }

  /**
   * Sets a chicken sitting a nest block.
   * @param {Block} nest The nest block to set the chicken sitting on.
   * @param {Entity} chicken The chicken to start sitting the nest.
   * @param {Dimension} dimension The dimension.
   */
  static #setChickenSitting(nest, chicken, dimension) {
    const rotationId = this.#ROTATION_STATE;
    const nestSeat = dimension.spawnEntity(this.#SEAT_ENTITY, nest.bottomCenter());
    nestSeat.setRotation({ x: 0, y: (nest.permutation.getState(rotationId) * 45) - 180 });
    nestSeat.getComponent(EntityComponentTypes.Rideable)?.addRider(chicken);
  }

  /**
   * Handles a Nest block being placed by a player.
   * @param {BlockComponentPlayerPlaceBeforeEvent} event The block event data.
   */
  beforeOnPlayerPlace(event) {
    const { permutationToPlace, player } = event;
    if (!player) return;
    const rotationState = NestBlockComponent.#ROTATION_STATE;
    event.permutationToPlace = permutationToPlace.withState(rotationState, NestBlockComponent.#getFacingRotation(player.getRotation().y));
  }

  /**
   * Handles a Nest block being interacted with by a player.
   * @param {BlockComponentPlayerInteractEvent} event The block event data.
   */
  onPlayerInteract({ player, block, dimension }) {
    if (!player) return;
    const chicken = getCaughtChicken(player);
    if (!chicken) return;

    releaseCaughtChicken(player);
    NestBlockComponent.#setChickenSitting(block, chicken, dimension);
  }
}


/*
 * 🦊 Ideas crafted into code by <@JeanLucasMCPE> — 2025
 * 💬 Questions or feedback? Ping me anytime! 🚀
 * ------------------------------------------
 */