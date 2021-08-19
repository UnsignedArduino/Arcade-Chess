namespace SpriteKind {
    export const Piece = SpriteKind.create()
}
function set_variables () {
    controls_enabled = true
    sprite_selected = null
    in_game = false
}
function get_overlapping_sprite (target: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            return sprite
        }
    }
    return [][0]
}
function set_tilemap (with_tile_pieces: boolean) {
    scene.setBackgroundColor(13)
    if (with_tile_pieces) {
        tiles.setSmallTilemap(tilemap`board_with_tile_pieces`)
    } else {
        tiles.setSmallTilemap(tilemap`board`)
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controls_enabled) {
        if (in_game) {
            unselect_piece()
            if (is_sprite(sprite_move_count)) {
                sprite_move_count.destroy()
            }
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controls_enabled) {
        if (in_game) {
            if (is_sprite(sprite_selected)) {
                if (on_available_tile()) {
                    if (grid.getSprites(tiles.locationOfSprite(sprite_cursor_pointer)).length > 0) {
                        grid.getSprites(tiles.locationOfSprite(sprite_cursor_pointer))[0].destroy()
                    }
                    grid.place(sprite_selected, tiles.locationOfSprite(sprite_cursor_pointer))
                    sprites.setDataBoolean(sprite_selected, "has_moved", true)
                    if (sprites.readDataString(sprite_selected, "type").includes("pawn")) {
                        if (sprites.readDataBoolean(sprite_selected, "is_white")) {
                            if (tiles.locationXY(tiles.locationOfSprite(sprite_selected), tiles.XY.row) == 2) {
                                promote_piece(sprite_selected)
                            }
                        } else {
                            if (tiles.locationXY(tiles.locationOfSprite(sprite_selected), tiles.XY.row) == 9) {
                                promote_piece(sprite_selected)
                            }
                        }
                    }
                    unselect_piece()
                    if (is_sprite(sprite_move_count)) {
                        sprite_move_count.destroy()
                    }
                } else {
                    scene.cameraShake(4, 200)
                }
            } else {
                if (is_sprite(get_overlapping_sprite(sprite_cursor_pointer, SpriteKind.Piece))) {
                    select_piece(get_overlapping_sprite(sprite_cursor_pointer, SpriteKind.Piece))
                    if (is_sprite(sprite_move_count)) {
                        sprite_move_count.destroy()
                    }
                    if (available_moves.length == 0) {
                        sprite_move_count = textsprite.create("Moves found: 0", 0, 2)
                    } else {
                        sprite_move_count = textsprite.create("Moves found: " + available_moves.length, 0, 15)
                    }
                    sprite_move_count.left = 2 * tiles.tileWidth()
                    sprite_move_count.top = 11.5 * tiles.tileWidth()
                }
            }
        }
    }
})
function promote_piece (piece: Sprite) {
    enable_controls(false)
    story.showPlayerChoices("Rook", "Knight", "Bishop", "Queen")
    if (sprites.readDataBoolean(piece, "is_white")) {
        if (story.checkLastAnswer("Rook")) {
            make_piece("white rook", [tiles.locationOfSprite(piece)])
        } else if (story.checkLastAnswer("Knight")) {
            make_piece("white knight", [tiles.locationOfSprite(piece)])
        } else if (story.checkLastAnswer("Bishop")) {
            make_piece("white bishop", [tiles.locationOfSprite(piece)])
        } else if (story.checkLastAnswer("Queen")) {
            make_piece("white queen", [tiles.locationOfSprite(piece)])
        }
    } else {
        if (story.checkLastAnswer("Rook")) {
            make_piece("black rook", [tiles.locationOfSprite(piece)])
        } else if (story.checkLastAnswer("Knight")) {
            make_piece("black knight", [tiles.locationOfSprite(piece)])
        } else if (story.checkLastAnswer("Bishop")) {
            make_piece("black bishop", [tiles.locationOfSprite(piece)])
        } else if (story.checkLastAnswer("Queen")) {
            make_piece("black queen", [tiles.locationOfSprite(piece)])
        }
    }
    piece.destroy()
    sprite_selected = sprite_piece
    timer.after(20, function () {
        enable_controls(true)
    })
}
function location_within_board (location_in_list: any[]) {
    if (tiles.locationXY(location_in_list[0], tiles.XY.column) > 9 || tiles.locationXY(location_in_list[0], tiles.XY.column) < 2) {
        return false
    }
    if (tiles.locationXY(location_in_list[0], tiles.XY.row) > 9 || tiles.locationXY(location_in_list[0], tiles.XY.row) < 2) {
        return false
    }
    return true
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
            make_piece(chess_names[index], [location])
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
    sprite_cursor_pointer = sprites.create(assets.image`cursor_overlapper`, SpriteKind.Player)
    sprite_cursor.z = 10
    sprite_cursor_pointer.z = 10
    sprite_cursor_pointer.setFlag(SpriteFlag.Invisible, true)
}
function calculate_move_for_pawn (piece: Sprite) {
    local_moves = []
    local_curr_pos = tiles.locationOfSprite(piece)
    if (sprites.readDataBoolean(piece, "is_white")) {
        if (location_within_board([tiles.locationInDirection(local_curr_pos, CollisionDirection.Top)])) {
            if (grid.getSprites(tiles.locationInDirection(local_curr_pos, CollisionDirection.Top)).length == 0) {
                local_moves.push(tiles.locationInDirection(local_curr_pos, CollisionDirection.Top))
                if (location_within_board([tiles.locationInDirection(tiles.locationInDirection(local_curr_pos, CollisionDirection.Top), CollisionDirection.Top)])) {
                    if (grid.getSprites(tiles.locationInDirection(tiles.locationInDirection(local_curr_pos, CollisionDirection.Top), CollisionDirection.Top)).length == 0 && !(sprites.readDataBoolean(piece, "has_moved"))) {
                        local_moves.push(tiles.locationInDirection(tiles.locationInDirection(local_curr_pos, CollisionDirection.Top), CollisionDirection.Top))
                    }
                }
            }
            local_curr_pos = tiles.locationInDirection(tiles.locationInDirection(tiles.locationOfSprite(piece), CollisionDirection.Top), CollisionDirection.Left)
            if (location_within_board([local_curr_pos])) {
                if (grid.getSprites(local_curr_pos).length > 0 && !(sprites.readDataBoolean(grid.getSprites(local_curr_pos)[0], "is_white"))) {
                    local_moves.push(local_curr_pos)
                }
            }
            local_curr_pos = tiles.locationInDirection(tiles.locationInDirection(tiles.locationOfSprite(piece), CollisionDirection.Top), CollisionDirection.Right)
            if (location_within_board([local_curr_pos])) {
                if (grid.getSprites(local_curr_pos).length > 0 && !(sprites.readDataBoolean(grid.getSprites(local_curr_pos)[0], "is_white"))) {
                    local_moves.push(local_curr_pos)
                }
            }
        }
    } else {
        if (location_within_board([tiles.locationInDirection(local_curr_pos, CollisionDirection.Bottom)])) {
            if (grid.getSprites(tiles.locationInDirection(local_curr_pos, CollisionDirection.Bottom)).length == 0) {
                local_moves.push(tiles.locationInDirection(local_curr_pos, CollisionDirection.Bottom))
                if (location_within_board([tiles.locationInDirection(tiles.locationInDirection(local_curr_pos, CollisionDirection.Bottom), CollisionDirection.Bottom)])) {
                    if (grid.getSprites(tiles.locationInDirection(tiles.locationInDirection(local_curr_pos, CollisionDirection.Bottom), CollisionDirection.Bottom)).length == 0 && !(sprites.readDataBoolean(piece, "has_moved"))) {
                        local_moves.push(tiles.locationInDirection(tiles.locationInDirection(local_curr_pos, CollisionDirection.Bottom), CollisionDirection.Bottom))
                    }
                }
            }
            local_curr_pos = tiles.locationInDirection(tiles.locationInDirection(tiles.locationOfSprite(piece), CollisionDirection.Bottom), CollisionDirection.Left)
            if (location_within_board([local_curr_pos])) {
                if (grid.getSprites(local_curr_pos).length > 0 && sprites.readDataBoolean(grid.getSprites(local_curr_pos)[0], "is_white")) {
                    local_moves.push(local_curr_pos)
                }
            }
            local_curr_pos = tiles.locationInDirection(tiles.locationInDirection(tiles.locationOfSprite(piece), CollisionDirection.Bottom), CollisionDirection.Right)
            if (location_within_board([local_curr_pos])) {
                if (grid.getSprites(local_curr_pos).length > 0 && sprites.readDataBoolean(grid.getSprites(local_curr_pos)[0], "is_white")) {
                    local_moves.push(local_curr_pos)
                }
            }
        }
    }
    return local_moves
}
function calculate_move (piece: Sprite) {
    if (sprites.readDataString(piece, "type").includes("pawn")) {
        return calculate_move_for_pawn(piece)
    } else if (sprites.readDataString(piece, "type").includes("rook")) {
        return calculate_move_for_rook(piece)
    } else {
        return []
    }
}
function calculate_move_for_rook (piece: Sprite) {
    local_moves = []
    for (let local_direction of [
    CollisionDirection.Left,
    CollisionDirection.Top,
    CollisionDirection.Right,
    CollisionDirection.Bottom
    ]) {
        local_curr_pos = tiles.locationOfSprite(piece)
        for (let index = 0; index < 8; index++) {
            local_curr_pos = tiles.locationInDirection(local_curr_pos, local_direction)
            if (!(location_within_board([local_curr_pos]))) {
                break;
            } else if (grid.getSprites(local_curr_pos).length == 0) {
                local_moves.push(local_curr_pos)
            } else if (sprites.readDataBoolean(grid.getSprites(local_curr_pos)[0], "is_white") != sprites.readDataBoolean(piece, "is_white")) {
                local_moves.push(local_curr_pos)
                break;
            } else {
                break;
            }
        }
    }
    return local_moves
}
function select_piece (sprite: Sprite) {
    sprite_selected = sprite
    available_moves = calculate_move(sprite_selected)
    for (let location of available_moves) {
        if (tiles.tileAtLocationEquals(location, assets.tile`white_tile`)) {
            tiles.setTileAt(location, assets.tile`green_white_tile`)
        } else {
            tiles.setTileAt(location, assets.tile`green_black_tile`)
        }
    }
}
function enable_controls (enable: boolean) {
    controls_enabled = enable
    if (enable) {
        controller.moveSprite(sprite_cursor_pointer, 50, 50)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function on_available_tile () {
    return sprite_cursor_pointer.tileKindAt(TileDirection.Center, assets.tile`green_white_tile`) || sprite_cursor_pointer.tileKindAt(TileDirection.Center, assets.tile`green_black_tile`)
}
function unselect_piece () {
    sprite_selected = null
    set_tilemap(false)
}
function make_piece (_type: string, location_as_list: any[]) {
    sprite_piece = sprites.create(chess_images[chess_names.indexOf(_type)], SpriteKind.Piece)
    grid.place(sprite_piece, location_as_list[0])
    sprite_piece.z = 5
    sprites.setDataString(sprite_piece, "type", _type)
    sprites.setDataBoolean(sprite_piece, "is_white", _type.includes("white"))
    sprites.setDataBoolean(sprite_piece, "has_moved", false)
    sprites.setDataBoolean(sprite_piece, "in_check", false)
    return sprite_piece
}
function is_sprite (sprite: Sprite) {
    sprite = sprite
    return sprite && !(spriteutils.isDestroyed(sprite))
}
let sprite: Sprite = null
let local_curr_pos: tiles.Location = null
let local_moves: tiles.Location[] = []
let sprite_cursor: Sprite = null
let chess_names: string[] = []
let chess_images: Image[] = []
let chess_tiles: Image[] = []
let sprite_piece: Sprite = null
let available_moves: tiles.Location[] = []
let sprite_cursor_pointer: Sprite = null
let sprite_move_count: TextSprite = null
let sprite_selected: Sprite = null
let controls_enabled = false
let in_game = false
set_variables()
make_cursor()
enable_controls(true)
set_tilemap(true)
place_pieces()
set_tilemap(false)
in_game = true
game.onUpdate(function () {
    sprite_cursor.top = sprite_cursor_pointer.top + 1
    sprite_cursor.left = sprite_cursor_pointer.left + 1
})
game.onUpdateInterval(100, function () {
    if (false) {
        if (is_sprite(sprite_selected)) {
            sprite_selected.say("me", 100)
        }
    }
})
