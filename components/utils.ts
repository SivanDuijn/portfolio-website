export default class Utils {
  static GetRandomInt(max_exclusive: number) {
    return Math.floor(Math.random() * max_exclusive);
  }
}
