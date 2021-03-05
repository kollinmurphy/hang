window.onload = function () {
    document.querySelector("#fontLoader").style.display = "none";

    var dictionary = new Dictionary();
    var clock = new Timer(90);
    var guess = new Guesser(clock);

    var sharedWords = [];
    var current_word;
    var pastWords = [];
    var letter_width;
    var letter_padding;
    var starting_pos;
    var pressed_key = -1;
    var color_state = 0;
    var updatedHighScore = -1;
    newWord(false);

    const letter_height = window.innerHeight * 2 / 5;
    const keysPerRow = 10;
    const keyboard_layout = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], ["a", "s", "d", "f", "g", "h", "j", "k", "l"], ["", "z", "x", "c", "v", "b", "n", "m"]];
    const key_size = Math.min(window.innerWidth * 0.9 / keysPerRow, window.innerHeight / 2 * 0.7 / 3);
    const keyboard_position = [window.innerWidth * 0.05, window.innerHeight * 5 / 10];

    var cvs = document.querySelector("#myCanvas");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = cvs.getContext('2d');
    var cvs_secondary = document.querySelector("#secondaryCanvas");
    cvs_secondary.width = window.innerWidth;
    cvs_secondary.height = window.innerHeight;
    var ctx_secondary = cvs_secondary.getContext('2d');

    var coin = document.querySelector("#imgCoin");
    var coin_animation = new GIF(ctx, coin, 48, 48);
    var gallows = new Gallows(ctx, window.innerWidth * 0.375, 50, window.innerWidth / 4, window.innerHeight / 2 * 0.4, clock.time, 0);
    var keyboard = new Keyboard(ctx, guess, keyboard_position, key_size, keysPerRow, clock, coin_animation, keyboard_layout);
    var themes = new Themes(gallows);

    draw();
    var drawClock = setInterval(draw, 100);
    var shakeClock;

    function draw() {
        if (!clock.frozen) {
            let frame = 16 - Math.floor(((clock.time + 12.4) % 3.2) * 5);
            if (frame === 16)
                frame = 0;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            ctx.beginPath(); // draw background color
            ctx.fillStyle = color_state === 1 ? "rgb(180,225,180)" : "rgb(220,220,220)";
            ctx.rect(0, 0, window.innerWidth, window.innerHeight);
            ctx.fill();

            ctx.beginPath(); // draw points
            ctx.font = "30px opensaucesans";
            ctx.textAlign = "left";
            ctx.fillStyle = "black";
            ctx.textBaseline = 'bottom';
            ctx.fillText(clock.points, 30, 65);
            let points_text_width = calculateStringWidth(clock.points);
            ctx.fillText(clock.coins, 30, 105);
            let coin_text_width = calculateStringWidth(clock.coins);
            coin_animation.draw(0, 36 + coin_text_width, 77, 22);
            ctx.font = "20px opensaucesans";
            ctx.fillText("points", 35 + points_text_width, 61);
            ctx.textBaseline = 'middle';

            gallows.drawHandler(clock.time, clock.horizShift);
            keyboard.draw(pressed_key);

            if (clock.floating) {
                let willstart = !guess.floaters[0].moving;
                for (let k = 0; k < guess.floaters.length; k++) {
                    if (guess.floaters[k].canmove) {
                        if (willstart) {
                            guess.floaters[k].start();
                        }
                    } else {
                        guess.floaters[k].curX += 30;
                    }

                    ctx.beginPath();
                    ctx.font = "30px opensaucesans";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    ctx.textBaseline = 'middle';
                    ctx.fillText(guess.floaters[k].letter, guess.floaters[k].curX, letter_height - 35);
                }
                for (let i = 0; i < current_word.length; i++) { // draw underline
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(starting_pos + i * (letter_width + letter_padding), letter_height);
                    ctx.lineTo(starting_pos + i * (letter_width + letter_padding) + letter_width, letter_height);
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                }
                setTimeout(draw, 15);
            } else {
                for (let i = 0; i < current_word.length; i++) { // draw letters of word
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(starting_pos + i * (letter_width + letter_padding), letter_height);
                    ctx.lineTo(starting_pos + i * (letter_width + letter_padding) + letter_width, letter_height);
                    ctx.strokeStyle = "black";
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.font = "30px opensaucesans";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    ctx.textBaseline = 'middle';
                    ctx.fillText(guess.incompleteWord[i], starting_pos + i * (letter_width + letter_padding) + letter_width / 2, letter_height - 35);

                    if (pressed_key === "hint" && guess.incompleteWord[i] === " ") {
                        keyboard.roundRect(ctx, starting_pos + i * (letter_width + letter_padding), letter_height - 60, letter_width, 45, letter_width / 6, "rgba(0,0,0,0)")
                        ctx.strokeStyle = "rgb(160,0,0)";
                        ctx.stroke();
                    }

                    if (guess.nextfloaters[i].coin) {
                        // keyboard.roundRect(ctx, starting_pos + i * (letter_width + letter_padding), letter_height - 60, letter_width, 45, letter_width / 6, "rgba(0,0,0,0)")
                        // ctx.strokeStyle = "rgb(255,255,0)";
                        // ctx.stroke();
                        coin_animation.draw(frame, starting_pos + i * (letter_width + letter_padding) + letter_width / 2 - 16, letter_height - 52);
                    }
                }
            }

            if (!clock.shaking) {
                clearInterval(shakeClock);
            }
            color_state = 0;
        }
        if (clock.lost) {
            if (updatedHighScore === -1) {
                updatedHighScore = Android.updateHighScore(clock.points);
                for (var i = 0; i < themes.themes.length; i++) {
                    if (!themes.themes[i].unlocked && clock.points >= themes.themes[i].points) {
                        themes.themes[i].unlocked = true;
                        Android.unlockTheme(themes.get_available().join("-"));
                        themes.newThemeUnlocked = true;
                    }
                }

            }

            ctx_secondary.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ctx_secondary.beginPath(); // draw background color
            ctx_secondary.fillStyle = "rgba(255,80,80," + clock.secondaryAlpha + ")";
            ctx_secondary.rect(0, 0, window.innerWidth, window.innerHeight);
            ctx_secondary.fill();
            ctx_secondary.beginPath();
            ctx_secondary.font = "72px FatCow";
            ctx_secondary.textAlign = "center";
            ctx_secondary.fillStyle = "white";
            ctx_secondary.textBaseline = 'bottom';
            if (clock.points === 0) {
                ctx_secondary.fillText("UH OH.", window.innerWidth / 2, window.innerHeight * 0.35);
            } else if (updatedHighScore === true) {
                ctx_secondary.fillText("NEW HIGH SCORE.", window.innerWidth / 2, window.innerHeight * 0.35);
            }
            ctx_secondary.fillText("YOU'VE BEEN HANGED.", window.innerWidth / 2, window.innerHeight * 0.45);
            ctx_secondary.textBaseline = 'top';
            ctx_secondary.fillText(clock.points + " points", window.innerWidth / 2, window.innerHeight * 0.46);
            ctx_secondary.textBaseline = 'middle';
            ctx_secondary.font = "42px FatCow";
            if (themes.newThemeUnlocked) {
                ctx_secondary.fillText("New theme unlocked.", window.innerWidth / 2, window.innerHeight * 0.15);
                ctx_secondary.fillText("Go to options to activate it.", window.innerWidth / 2, window.innerHeight * 0.22);
            }
            ctx_secondary.fillText("Double tap to exit.", window.innerWidth / 2, window.innerHeight * 0.65);
            ctx_secondary.textBaseline = 'alphabetic';
            ctx_secondary.font = "28px FatCow";
            ctx_secondary.fillText("The word was", window.innerWidth / 2, window.innerHeight * 0.89);
            ctx_secondary.textBaseline = 'top';
            ctx_secondary.font = "48px FatCow";
            ctx_secondary.fillText(current_word + ".", window.innerWidth / 2, window.innerHeight * 0.9);

            if (clock.secondaryAlpha < 0.9) {
                clock.secondaryAlpha += 0.003;
            }

            setTimeout(draw, 15);
        }
    }

    function newWord(save, rand = true) {
        if (save) {
            pastWords.push(current_word);
        }
        let oldSharedWords = sharedWords;
        sharedWords = [];
        let sharedLetters = [];

        guess.guessedLetters = [];
        while (sharedWords.length === 0 || pastWords.includes(current_word) || sharedLetters.length === current_word.length) {
            if (rand)
                current_word = dictionary.random_word();
            else
                current_word = oldSharedWords[Math.floor(Math.random() * oldSharedWords.length)];
            sharedWords = dictionary.find_shared_words(current_word, 2);
            if (save) {
                sharedLetters = dictionary.find_shared_letters(new Word(current_word), new Word(pastWords[pastWords.length - 1]));
            }
        }
        letter_width = Math.min(50, window.innerWidth * 0.9 / (current_word.length * 1.4));
        letter_padding = letter_width / 3;
        starting_pos = Math.round(window.innerWidth / 2 - (current_word.length * (letter_width + letter_padding) - letter_padding) / 2);
        guess.setWord(current_word, starting_pos, letter_width, letter_padding);

        if (save) {
            sharedLetters = dictionary.find_shared_letters(new Word(current_word), new Word(pastWords[pastWords.length - 1]));
            let tmpWord = current_word.split("");
            // debugger
            for (let k = 0; k < guess.floaters.length; k++) {
                if (sharedLetters.includes(guess.floaters[k].letter)) {
                    let idx = sharedLetters.indexOf(guess.floaters[k].letter);
                    let idxWord = tmpWord.indexOf(guess.floaters[k].letter);
                    tmpWord[idxWord] = " ";
                    guess.floaters[k].setTarget(starting_pos + idxWord * (letter_width + letter_padding) + letter_width / 2);
                    sharedLetters[idx] = " ";
                }
            }
            for (let j = 0; j < sharedLetters.length; j++) { // duplicate floating letters when necessary
                if (sharedLetters[j] != " ") {
                    for (let k = 0; k < guess.floaters.length; k++) {
                        if (guess.floaters[k].letter === sharedLetters[j]) {
                            guess.floaters.push(new FloatingLetter(sharedLetters[j], guess.floaters[k].initX));
                            let idxWord = tmpWord.indexOf(sharedLetters[j]);
                            tmpWord[idxWord] = " ";
                            k = guess.floaters.length;
                            guess.floaters[guess.floaters.length - 1].setTarget(starting_pos + idxWord * (letter_width + letter_padding) + letter_width / 2);
                        }
                    }
                }
            }
            for (let k = 0; k < guess.floaters.length; k++) {
                if (guess.completeWord.includes(guess.floaters[k].letter)) {
                    guess.guessLetter(guess.floaters[k].letter, false);
                }
            }
        }
    }

    document.addEventListener("touchstart", function (e) {
        if (!clock.inputFrozen) {
            let touchX = e.touches[0].clientX;
            let touchY = e.touches[0].clientY;
            let offset = 3;
            for (let row = 0; row < keyboard_layout.length; row++) {
                for (let col = 0; col < keyboard_layout[row].length; col++) {
                    let keyX = key_size * col + offset + keyboard_position[0];
                    let keyY = key_size * row + offset + keyboard_position[1];
                    if (!guess.isGuessed(keyboard_layout[row][col]) && touchX > keyX && touchX < keyX + key_size - offset * 2 && touchY > keyY && touchY < keyY + key_size - offset * 2) {
                        pressed_key = -1;
                        let g = guess.guessLetter(keyboard_layout[row][col]);
                        if (!g) {
                            clock.shake(10);
                            shakeClock = setInterval(draw, 25);
                            clock.time -= 1; // penalty for wrong guess
                        } else if (g === true) {
                            completeWord();
                        }
                    }
                }
            }
            if (touchX > keyboard_position[0] + key_size * 5 + offset && touchX < keyboard_position[0] + key_size * 7 - offset * 2 && touchY > key_size * 3.25 + offset + keyboard_position[1] && touchY < key_size * 4.25 - offset * 2 + keyboard_position[1]) {
                // hint button
                if (pressed_key === "hint") {
                    pressed_key = -1;
                } else if (clock.coins > 1) {
                    pressed_key = "hint";
                }
            }
            if (touchX > keyboard_position[0] + key_size * 2 + offset && touchX < keyboard_position[0] + key_size * 4 - offset * 2 && touchY > key_size * 3.25 + offset + keyboard_position[1] && touchY < key_size * 4.25 - offset * 2 + keyboard_position[1]) {
                // time button
                if (clock.coins > 0) {
                    pressed_key = "time";
                    clock.time += 10;
                    clock.coins -= 1;
                }
            }
            if (pressed_key === "hint" && clock.coins > 1) {
                if (touchY > letter_height - 60 && touchY < letter_height - 15) {
                    for (let k = 0; k < guess.incompleteWord.length; k++) {
                        if (guess.incompleteWord[k] === " ") {
                            if (touchX > starting_pos + k * (letter_width + letter_padding) && touchX < starting_pos + k * (letter_width + letter_padding) + letter_width) {
                                pressed_key = -1;
                                clock.coins -= 2;
                                if (guess.guessLetter(guess.completeWord[k]) === true) {
                                    completeWord();
                                }
                            }
                        }
                    }
                }
            }
            draw();
        } else if (clock.lost) {
            if (clock.recentTouch) {
                document.location = "home.html";
            } else {
                clock.recentTouch = true;
                setTimeout(function() {
                    clock.recentTouch = false;
                }, 350);
            }
        }
    });

    document.addEventListener("touchend", function (e) {
        if (pressed_key === "time") {
            pressed_key = -1;
        }
        draw();
    });

    function completeWord() {
        clock.time += 6;
        if (guess.completeWord.length < 6) {
            clock.points += 3;
        } else if (guess.completeWord.length < 9) {
            clock.points += 4;
        } else {
            clock.points += 5;
        }
        color_state = 1;
        draw(); // draw before it's frozen
        clock.freeze(760);
        setTimeout(draw, 760);
        newWord(true, false);

    }

    function calculateStringWidth(text) {
        var div = document.createElement('div');
        div.setAttribute('class', 'textDimensionCalculation');
        div.innerHTML = text;
        document.body.appendChild(div);
        let width = div.offsetWidth;
        div.parentNode.removeChild(div);
        return width;
    }
};