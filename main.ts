namespace SpriteKind {
    export const Piece = SpriteKind.create()
}
function set_variables () {
    controls_enabled = true
}
function set_tilemap (with_tile_pieces: boolean) {
    scene.setBackgroundColor(13)
    if (with_tile_pieces) {
        tiles.setSmallTilemap(tilemap`board_with_tile_pieces`)
    } else {
        tiles.setSmallTilemap(tilemap`board`)
    }
}
function place_pieces () {
    tiles.destroySpritesOfKind(SpriteKind.Piece)
    chess_tiles = [
    assets.tile`white_pawn`,
    assets.tile`white_rook`,
    assets.tile`white_knight`,
    assets.tile`white_bishop`,
    assets.tile`white_king`,
    assets.tile`white_queen`,
    assets.tile`black_pawn`,
    assets.tile`black_rook`,
    assets.tile`black_knight`,
    assets.tile`black_bishop`,
    assets.tile`black_king`,
    assets.tile`black_queen`
    ]
    chess_images = [
    assets.image`white_pawn`,
    assets.image`white_rook`,
    assets.image`white_knight`,
    assets.image`white_bishop`,
    assets.image`white_king`,
    assets.image`white_queen`,
    assets.image`black_pawn`,
    assets.image`black_rook`,
    assets.image`black_knight`,
    assets.image`black_bishop`,
    assets.image`black_king`,
    assets.image`black_queen`
    ]
    chess_names = [
    "white pawn",
    "white rook",
    "white knight",
    "white bishop",
    "white king",
    "white queen",
    "black pawn",
    "black rook",
    "black knight",
    "black bishop",
    "black king",
    "black queen"
    ]
    for (let index = 0; index <= chess_tiles.length - 1; index++) {
        for (let location of tiles.getTilesByType(chess_tiles[index])) {
            sprite_piece = sprites.create(chess_images[index], SpriteKind.Piece)
            tiles.placeOnTile(sprite_piece, location)
            sprites.setDataString(sprite_piece, "type", chess_names[index])
        }
    }
}
function make_cursor () {
    sprite_cursor = sprites.create(img`
        f . . . . . . . . . 
        f f . . . . . . . . 
        f 1 f . . . . . . . 
        f 1 1 f . . . . . . 
        f 1 1 1 f . . . . . 
        f 1 1 1 1 f . . . . 
        f 1 1 1 1 1 f . . . 
        f 1 1 1 1 1 1 f . . 
        f 1 1 1 1 1 1 1 f . 
        f 1 1 f 1 f f f f f 
        f 1 f f 1 f . . . . 
        f f . . f 1 f . . . 
        f . . . f 1 f . . . 
        . . . . . f 1 f . . 
        . . . . . f 1 f . . 
        . . . . . . f . . . 
        `, SpriteKind.Player)
    sprite_cursor.setFlag(SpriteFlag.Ghost, true)
    sprite_cursor_pointer = sprites.create(img`
        f 
        `, SpriteKind.Player)
}
function enable_controls (enable: boolean) {
    controls_enabled = enable
    if (enable) {
        controller.moveSprite(sprite_cursor_pointer, 75, 75)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
let sprite_cursor_pointer: Sprite = null
let sprite_cursor: Sprite = null
let sprite_piece: Sprite = null
let chess_names: string[] = []
let chess_images: Image[] = []
let chess_tiles: Image[] = []
let controls_enabled = false
set_variables()
make_cursor()
enable_controls(true)
set_tilemap(true)
place_pieces()
set_tilemap(false)
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
})
