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
let controls_enabled = false
set_variables()
make_cursor()
enable_controls(true)
set_tilemap(true)
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
})
