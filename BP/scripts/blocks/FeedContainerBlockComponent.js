import { BlockComponentPlayerBreakEvent, BlockComponentPlayerPlaceBeforeEvent, system } from '@minecraft/server';
import { Vec3 } from '../utils.js';

/**
 * Realistic Animals Feed Container block component.
 * @implements {import('@minecraft/server').BlockCustomComponent}
 */
export class FeedContainerBlockComponent {
  static COMPONENT_ID = 'raa:feed_container';
  static #PART_STATE = 'raa:part';

  // Vec3 offset utils
  static #NORTH_OFFSET = new Vec3(0, 0, -1);
  static #SOUTH_OFFSET = new Vec3(0, 0, 1);
  static #EAST_OFFSET = new Vec3(1, 0, 0);
  static #WEST_OFFSET = new Vec3(-1, 0, 0);

  /**
   * Map of cardinal keys to the pair block part unit offset.
   * @type {{[direction: string]: { left: Vec3, right: Vec3 }}}
   */
  static #PART_OFFSETS = {
    north: { left: this.#WEST_OFFSET, right: this.#EAST_OFFSET },
    south: { left: this.#EAST_OFFSET, right: this.#WEST_OFFSET },
    east: { left: this.#NORTH_OFFSET, right: this.#SOUTH_OFFSET },
    west: { left: this.#SOUTH_OFFSET, right: this.#NORTH_OFFSET }
  };

  /**
   * Handles a Feed Container block being placed by a player.
   * @param {BlockComponentPlayerPlaceBeforeEvent} event The block event data.
   */
  beforeOnPlayerPlace(event) {
    const { block, permutationToPlace } = event;
    const oppositeBlock = block.offset(FeedContainerBlockComponent.#PART_OFFSETS[permutationToPlace.getState('minecraft:cardinal_direction') ?? 'north'].left);
    if (!oppositeBlock?.isAir) {
      event.cancel = true;
      return;
    }

    system.run(() => {
      if (block.permutation !== permutationToPlace) return;
      oppositeBlock.setPermutation(permutationToPlace.withState(FeedContainerBlockComponent.#PART_STATE, 'right'));
    });
  }

  /**
   * Handles a Feed Container block being broken by a player.
   * @param {BlockComponentPlayerBreakEvent} event The block event data.
   */
  onPlayerBreak({ block, brokenBlockPermutation }) {
    const direction = brokenBlockPermutation.getState('minecraft:cardinal_direction');
    const part = brokenBlockPermutation.getState(FeedContainerBlockComponent.#PART_STATE);
    if (!direction || !part) return;

    const oppositeBlock = block.offset(FeedContainerBlockComponent.#PART_OFFSETS[direction][part]);
    if (oppositeBlock?.typeId !== brokenBlockPermutation.type.id) return;
    oppositeBlock.setType('minecraft:air');
  }
}


/*
 * 🦊 Ideas crafted into code by <@JeanLucasMCPE> — 2025
 * 💬 Questions or feedback? Ping me anytime! 🚀
 * ------------------------------------------
 */