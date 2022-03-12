const { Listener, Store, Piece } = require("@sapphire/framework");

class PiecePostLoadListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "piecePostLoad",
      once: false,
      event: "piecePostLoad",
    });
  }

  /**
   *
   * @param { Store } store
   * @param { Piece } piece
   */
  run(store, piece) {
    this.container.logger.info(`Loaded command ${piece.name} into store ${store.name}`);
  }
}

module.exports = { PiecePostLoadListener };
