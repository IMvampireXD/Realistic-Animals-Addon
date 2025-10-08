import { system } from '@minecraft/server';

// Block Components
import { NestBlockComponent } from '../blocks/NestBlockComponent.js';

/**
 * Centralizes the Realistic Animals Add-On block components registry.
 */
export class BlockComponents {
  /**
   * Array of block custom components to register.
   * @type {{ COMPONENT_ID: string, new() => import('@minecraft/server').BlockCustomComponent }[]}
   */
  static #components = [
    NestBlockComponent
  ];

  /**
   * Registers the Realistic Animals block components once the scripts initialize.
   */
  static register() {
    system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
      for (const component of this.#components) {
        blockComponentRegistry.registerCustomComponent(component.COMPONENT_ID, new component());
      }

      this.#components = undefined;
    });
  }
}


/*
 * 🦊 Ideas crafted into code by <@JeanLucasMCPE> — 2025
 * 💬 Questions or feedback? Ping me anytime! 🚀
 * ------------------------------------------
 */