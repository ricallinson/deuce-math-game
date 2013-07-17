/*global define: true, document: true*/

"use strict";

define(["jquery", "libs/game", "libs/apprise", "tmpls"], function ($, Game, apprise, tmpls) {

    $("body").html(tmpls["game.html"]);

    var board = $(".game-board"),
        width = $(".screen").width(),
        height = $(document).height(),
        game;

    board.width(width);
    board.height(height - $(".game-console").height());

    game = new Game(board, $(".game-info"), $(".game-score"));
    game.start();

    game.on("gameover", function () {
        apprise("Game Over", {}, function () {
            game.restart();
        });
    });

    $(".restart").click(function () {
        game.restart();
    });

    $(".clean").click(function () {
        game.clean();
    });
});