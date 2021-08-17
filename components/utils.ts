import { cross } from 'mathjs';
import p5 from 'p5';

export default class Utils {
  static GetRandomInt(max_exclusive: number) {
    return Math.floor(Math.random() * max_exclusive);
  }

  static CrossForP5(p1: p5.Vector, p2: p5.Vector) {
    let c = cross([p1.x, p1.y, p1.z], [p2.x, p2.y, p2.z]);
    console.log(c);
  }
}
