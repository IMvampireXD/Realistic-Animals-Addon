/**
 * Contains a description of a vector.
 * @typedef {import('@minecraft/server').Vector3} Vector3
 */

/**
 * Vec3 object constructor. Represents a Vector3 with common utility methods.
 */
export class Vec3 {
  /**
   * Creates a new Vec3 from a Vector3 object.
   * @param {Vector3} obj The object containing the three vector components.
   * @returns {Vec3} The new Vec3.
   */
  static from(obj) {
    return new this(obj.x, obj.y, obj.z);
  }

  /**
   * Creates a new Vec3 object.
   * @param {number} x X component of this vector.
   * @param {number} y Y component of this vector.
   * @param {number} z Z component of this vector.
   */
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Sums another Vector3 with this Vec3.
   * @param {Vec3|Vector3} vec3 The Vector3 to sum.
   * @returns {Vec3} A Vec3 representing the sum of both vectors.
   */
  add(vec3) {
    return new Vec3(this.x + vec3.x, this.y + vec3.y, this.z + vec3.z);
  }

  /**
   * Subtracts another Vector3 from this Vec3.
   * @param {Vec3|Vector3} vec3 The Vector3 to subtract.
   * @returns {Vec3} A Vec3 representing the subtraction.
   */
  subtract(vec3) {
    return new Vec3(this.x - vec3.x, this.y - vec3.y, this.z - vec3.z);
  }

  /**
   * Multiplies this Vec3 by a scalar value.
   * @param {number} scalar The scalar value to multiply with.
   * @returns {Vec3} A Vec3 representing the multiplicated vector.
   */
  multiplyScalar(scalar) {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }
}


/*
 * 🦊 Ideas crafted into code by <@JeanLucasMCPE> — 2025
 * 💬 Questions or feedback? Ping me anytime! 🚀
 * ------------------------------------------
 */