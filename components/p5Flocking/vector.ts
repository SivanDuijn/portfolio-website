export class Vector {
  constructor(public x: number, public y: number, public z: number) {}

  public add(vec: Vector) {
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    return this;
  }

  public sub(vec: Vector) {
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    return this;
  }

  public mul(v: number) {
    this.x *= v;
    this.y *= v;
    this.z *= v;
    return this;
  }

  public div(v: number) {
    this.x /= v;
    this.y /= v;
    this.z /= v;
    return this;
  }

  public dot(vec: Vector) {
    return this.x * vec.x + this.y * vec.y + this.z * vec.z;
  }

  public length() {
    return Math.sqrt(this.dot(this));
  }

  public normalize() {
    this.div(this.length());
    return this;
  }

  public setLength(l: number) {
    const len = this.length();
    if (len == 0) return this;
    this.mul(l / len);
    return this;
  }

  public limitLength(maxL: number) {
    const len = this.length();
    if (len > maxL) this.mul(maxL / len);
    return this;
  }

  public dist(vec: Vector) {
    return Vector.sub(this, vec).length();
  }

  public copy() {
    return new Vector(this.x, this.y, this.z);
  }

  public static add(v1: Vector, v2: Vector) {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }
  public static sub(v1: Vector, v2: Vector) {
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }
  public static mul(vec: Vector, v: number) {
    return new Vector(vec.x * v, vec.y * v, vec.z * v);
  }
  public static div(vec: Vector, v: number) {
    return new Vector(vec.x / v, vec.y / v, vec.z / v);
  }
}
