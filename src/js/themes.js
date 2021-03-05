class Themes {
    constructor(gallows) {
        this.all_themes = [0, 1];

        this.gallows = gallows;

        let theme = Android.getTheme();
        // var themes_available = [0, 1];
        this.themes_available = Android.getAvailableThemes().split("-");
        this.theme_index = this.themes_available.indexOf(theme);
        this.gallows.theme = theme;
        this.next_theme_index = 0;
        for (let i = 0; i < this.all_themes.length; i++) {
            if (!this.all_themes.includes(this.themes_available[i])) {
                this.next_theme_index = this.all_themes[i];
                i = 100;
            }
        }

        this.themes = [{
            index: 0,
            name: "Original",
            points: 0,
            unlocked: this.themes_available.includes(0)
        },
        {
            index: 1,
            name: "Cool",
            points: 50,
            unlocked: this.themes_available.includes(1)
        }];

        this.newThemeUnlocked = false;
    }

    get_available() {
        this.themes_available = [];
        for (var i = 0; i < this.themes.length; i++) {
            if (this.themes[i].unlocked) {
                this.themes_available.push(this.themes[i].index);
            }
        }
        return this.themes_available;
    }

    draw() {
        this.gallows.drawHandler(0, 0);
    }

    scroll(positive) {
        if (this.theme_index === this.themes_available.length - 1) {
            this.theme_index = 0;
        } else {
            this.theme_index += 1;
        }
        this.gallows.theme = this.themes_available[this.theme_index];
    }
}