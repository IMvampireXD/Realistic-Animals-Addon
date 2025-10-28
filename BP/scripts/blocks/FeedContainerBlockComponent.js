import { BlockComponentPlayerBreakEvent, BlockComponentPlayerPlaceBeforeEvent, BlockComponentPlayerInteractEvent, BlockPermutation, Block, EntityComponentTypes, EquipmentSlot, GameMode, system } from '@minecraft/server';
import { Vec3 } from '../utils.js';

/**
 * Realistic Animals Feed Container block component.
 * @implements {import('@minecraft/server').BlockCustomComponent}
 */
export class FeedContainerBlockComponent {
  static COMPONENT_ID = 'raa:feed_container';
  static #PART_STATE = 'raa:part';
  static #FILLED_STATE = 'raa:filled';
  static #CHICKEN_FEED_TYPE = 'raa:chicken_feed';

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

  constructor() {
    this.onPlayerBreak = this.onPlayerBreak.bind(this);
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }

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
    const oppositePart = this.#getOppositePart(block, brokenBlockPermutation);
    if (!oppositePart) return;
    oppositePart.setType('minecraft:air');
  }

  /**
   * Handles a Feed Container block being interacted with by a player.
   * @param {BlockComponentPlayerInteractEvent} event The block event data.
   */
  onPlayerInteract({ block, player, dimension }) {
    if (!player) return;
    const filledStateName = FeedContainerBlockComponent.#FILLED_STATE;
    const { permutation } = block;
    if (permutation.getState(filledStateName)) return;

    const equippable = player.getComponent(EntityComponentTypes?.Equippable);
    const handItem = equippable?.getEquipment(EquipmentSlot.Mainhand);
    if (handItem?.typeId !== FeedContainerBlockComponent.#CHICKEN_FEED_TYPE) return;

    const oppositePart = this.#getOppositePart(block, permutation);
    if (!oppositePart) return;
    
    block.setPermutation(permutation.withState(filledStateName, true));
    oppositePart.setPermutation(oppositePart.permutation.withState(filledStateName, true));
    dimension.playSound('block.composter.fill', block.center(), { volume: 1.3, pitch: 0.8 });

    if (player.getGameMode() === GameMode.Creative) return;
    handItem.amount > 1
      ? handItem.amount-- && equippable.setEquipment(EquipmentSlot.Mainhand, handItem)
      : equippable.setEquipment(EquipmentSlot.Mainhand, null);
  }

  /**
   * Gets the opposite part block of a Feed Container block.
   * @param {Block} block The Feed Container block.
   * @param {BlockPermutation} permutation The Feed Container block permutation.
   * @returns {Block|undefined} The opposite part block, if loaded and placed.
   */
  #getOppositePart(block, permutation) {
    const direction = permutation.getState('minecraft:cardinal_direction');
    const part = permutation.getState(FeedContainerBlockComponent.#PART_STATE);
    if (!direction || !part) return;

    const oppositeBlock = block.offset(FeedContainerBlockComponent.#PART_OFFSETS[direction][part]);
    if (oppositeBlock?.typeId !== permutation.type.id) return;

    return oppositeBlock;
  }
}


/*
 * 🦊 Ideas crafted into code by <@JeanLucasMCPE> — 2025
 * 💬 Questions or feedback? Ping me anytime! 🚀
 * ------------------------------------------
 */