class Guesser {
    constructor(clock) {
        this.completeWord = "";
        this.incompleteWord = [];
        this.guessedLetters = [];
        this.floaters = [];
        this.nextfloaters = [];
        this.clock = clock;
    }

    setWord(word, starting_pos, letter_width, letter_padding) {
        this.completeWord = word.split("");
        this.incompleteWord = new Array(word.length).fill(" ");
        console.log(word);
        this.floaters = this.nextfloaters;
        this.nextfloaters = [];
        for (let i = 0; i < this.completeWord.length; i++) {
            this.nextfloaters.push(new FloatingLetter(this.completeWord[i], starting_pos + i * (letter_width + letter_padding) + letter_width / 2));
        }
    }

    isGuessed(letter) {
        if (this.guessedLetters.includes(letter + "1")) {
            return 1;
        } else if (this.guessedLetters.includes(letter + "2")) {
            return 2;
        } else {
            return false;
        }
    }

    guessLetter(letter, penalty = true) {
        let right = false;
        let lettersLeft = 0;
        for (let i = 0; i < this.incompleteWord.length; i++) {
            if (this.incompleteWord[i] === " ") {
                if (this.completeWord[i] === letter) {
                    if (this.nextfloaters[i].coin && penalty) {
                        this.clock.coins += 1;
                    }
                    this.nextfloaters[i].coin = false;
                    right = 2;
                    this.incompleteWord[i] = letter;
                } else {
                    lettersLeft += 1;
                }
            }
        }
        if (!penalty) {
            this.guessedLetters.push(letter + "2");
            return 2;
        }
        if (lettersLeft === 0) {
            this.guessedLetters.push(letter + "2");
            return true;
        }
        if (right === 2) {
            this.guessedLetters.push(letter + "2");
        } else {
            this.guessedLetters.push(letter + "1");
        }
        return right;
    }
}