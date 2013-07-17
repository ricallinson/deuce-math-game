/*jshint quotmark:false*/
/*global define:true, document:true, window:true*/

"use strict";

// AMD Define
define(["jquery"], function ($) {

    // Apprise 1.5 by Daniel Raftery
    // http://thrivingkings.com/apprise
    //
    // Button text added by Adam Bezulski
    //

    return function apprise(string, args, callback) {

        var index,
            defaultArgs = {
                'confirm'       :   false,      // Ok and Cancel buttons
                'verify'        :   false,      // Yes and No buttons
                'input'         :   false,      // Text input (can be true or string for default text)
                'animate'       :   false,      // Groovy animation (can true or number, default is 400)
                'textOk'        :   'Ok',       // Ok button default text
                'textCancel'    :   'Cancel',   // Cancel button default text
                'textYes'       :   'Yes',      // Yes button default text
                'textNo'        :   'No'        // No button default text
            },
            aHeight,
            aWidth,
            aniSpeed,
            aText;

        if (args) {
            for (index in defaultArgs) {
                if (typeof args[index] === "undefined") {
                    args[index] = defaultArgs[index];
                }
            }
        }
        
        aHeight = $(document).height();
        aWidth = $(document).width();

        $('body').append('<div class="appriseOverlay" id="aOverlay"></div>');
        $('.appriseOverlay').css('height', aHeight).css('width', aWidth).fadeIn(100);
        $('body').append('<div class="appriseOuter"></div>');
        $('.appriseOuter').append('<div class="appriseInner"></div>');
        $('.appriseInner').append(string);
        $('.appriseOuter').css("left", ($(window).width() - $('.appriseOuter').width()) / 2 + $(window).scrollLeft() + "px");
        
        if (args) {
            if (args.animate) {
                aniSpeed = args.animate;
                if (isNaN(aniSpeed)) {
                    aniSpeed = 400;
                }
                $('.appriseOuter').css('top', '-200px').show().animate({top: "100px"}, aniSpeed);
            } else {
                $('.appriseOuter').css('top', '100px').fadeIn(200);
            }
        } else {
            $('.appriseOuter').css('top', '100px').fadeIn(200);
        }
        
        if (args) {
            if (args.input) {
                if (typeof(args.input) === 'string') {
                    $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" value="' + args.input + '" /></div>');
                } else {
                    $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" /></div>');
                }
                $('.aTextbox').focus();
            }
        }

        $('.appriseInner').append('<div class="aButtons"></div>');

        if (args) {
            if (args.confirm || args.input) {
                $('.aButtons').append('<button value="ok">' + args.textOk + '</button>');
                $('.aButtons').append('<button value="cancel">' + args.textCancel + '</button>');
            } else if (args.verify) {
                $('.aButtons').append('<button value="ok">' + args.textYes + '</button>');
                $('.aButtons').append('<button value="cancel">' + args.textNo + '</button>');
            } else {
                $('.aButtons').append('<button value="ok">' + args.textOk + '</button>');
            }
        } else {
            $('.aButtons').append('<button value="ok">Ok</button>');
        }

        $(document).keydown(function (e) {
            if ($('.appriseOverlay').is(':visible')) {
                if (e.keyCode === 13) {
                    $('.aButtons > button[value="ok"]').click();
                }
                if (e.keyCode === 27) {
                    $('.aButtons > button[value="cancel"]').click();
                }
            }
        });

        aText = $('.aTextbox').val();

        if (!aText) {
            aText = false;
        }

        $('.aTextbox').keyup(function () {
            aText = $(this).val();
        });
       
        $('.aButtons > button').click(function () {

            var wButton;

            $('.appriseOverlay').remove();
            $('.appriseOuter').remove();

            if (callback) {
                wButton = $(this).attr("value");
                if (wButton === 'ok') {
                    if (args) {
                        if (args.input) {
                            callback(aText);
                        } else {
                            callback(true);
                        }
                    } else {
                        callback(true);
                    }
                } else if (wButton === 'cancel') {
                    callback(false);
                }
            }
        });
    };
});
