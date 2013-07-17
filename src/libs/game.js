/*global define: true*/

"use strict";

define(["jquery"], function ($) {

    function Game(board, info, score) {

        var i;

        this.board = board;
        this.info = info;
        this.score = score;
        this.height = this.board.height();
        this.width = this.board.width();
        this.rows = 8;
        this.cols = 6;
        this.sum = 2;
        this.turn = 0;
        this.points = 0;
        this.gameId = null;

        for (i = 0; i < this.cols; i = i + 1) {
            this.addColumn();
        }

        console.log("Go");
    }

    Game.prototype.random = function (max) {
        return Math.floor((Math.random() * (max || 9)) + 1);
    };

    Game.prototype.addColumn = function () {

        var column = $("<div/>");

        column.addClass("column");
        column.width(this.width / this.cols);
        column.height(this.height);

        this.board.append(column);
    };

    Game.prototype.addBlock = function (val) {

        var block = $("<div/>");

        val = val || this.random();

        block.addClass("block");
        block.addClass("number" + val);
        block.css("top", this.height);
        block.width(this.width / this.cols);
        block.height(this.height / this.rows);
        block.attr("data-val", val);
        block.html(val);

        $(this.board.children().get(this.random(this.cols) - 1)).append(block);

        block.animate({
            top: "0px"
        }, 500);
    };

    Game.prototype.removeBlock = function (index, block) {
        block.remove();
    };

    Game.prototype.updateSum = function () {

        var last = this.sum;

        do {
            this.sum = this.random() + this.turn;
        }
        while (last === this.sum);

        this.info.html(this.sum);
    };

    Game.prototype.updatePoints = function (turn, used, sum) {
        this.points = this.points + ((turn + Math.round(sum / used, 0)) * 1000);
        this.score.html(this.points);
    };

    Game.prototype.hasEnded = function () {

        var length = this.board.children().length,
            column,
            node;

        for (column = 0; column < length; column = column + 1) {
            node = this.board.children().get(column);
            if ($(node).children().length >= this.rows) {
                return true;
            }
        }

        return false;
    };

    Game.prototype.setup = function () {

        var numBlocks = this.rows,
            i;

        $(".block").each(this.removeBlock);

        for (i = 0; i < numBlocks; i = i + 1) {
            this.addBlock();
        }

        this.info.html(this.sum);
        this.score.html(this.turn);

        this.listen();
    };

    Game.prototype.listen = function () {

        var self = this;

        this.board.on("click", function (e) {

            var total = 0,
                currentNode = $(e.target);

            currentNode.toggleClass("selected");

            $(".selected").each(function (index, node) {
                total = total + parseInt($(node).attr("data-val"), 10);
            });

            if (total === self.sum) {

                self.updatePoints(self.turn, $(".selected").length, self.sum);

                self.turn = self.turn + 1;

                $(".selected").each(self.removeBlock);

                self.updateSum();
            }
        });
    };

    Game.prototype.nextTick = function (gameId, interval, scope) {

        if (scope.hasEnded()) {
            scope.stop();
        } else if (scope.gameId === gameId) {
            scope.addBlock();
            setTimeout(function () {
                scope.nextTick(gameId, interval, scope);
            }, interval);
        }
    };

    Game.prototype.stop = function () {

        this.board.off("click");

        console.log("Game over");
    };

    Game.prototype.start = function (sum, turn, points) {

        this.gameId = new Date().getTime();

        this.sum = sum || 2;
        this.turn = turn || 0;
        this.points = points || 0;
        this.setup();

        this.nextTick(this.gameId, 3000, this);
    };

    Game.prototype.restart = function () {
        this.stop();
        this.start();
    };

    Game.prototype.clean = function () {
        $(".block").removeClass("selected");
    };

    return Game;
});