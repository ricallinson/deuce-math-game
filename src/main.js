/*global define: true, document: true*/

"use strict";

define(["jquery", "libs/game", "tmpls"], function ($, Game, tmpls) {

	$("body").html(tmpls["game.html"]);

	var board = $(".game-board"),
		width = $(".screen").width(),
		height = $(document).height(),
		game;

	board.width(width);
	board.height(height - $(".game-console").height());

	game = new Game(board, $(".game-info"), $(".game-score"));
	game.start();

	$(".restart").click(function () {
		game.restart();
	});

	$(".clean").click(function () {
		game.clean();
	});
});