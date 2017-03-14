class Color {
    public static BLACK: Color = new Color(0, 0, 0);
    public static WHITE: Color = new Color(255, 255, 255);
    public static RED: Color = new Color(255, 0, 0);
    public static BLUE: Color = new Color(0, 0, 255);
    public static GREEN: Color = new Color(0, 255, 0);

    private r: number = 0;
    private g: number = 0;
    private b: number = 0;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public setToItem(item: ShapeItem) {
        item.setColor(this.r, this.g, this.b);
    }

    public setToBillboardText(billboard: TextBillboardItem) {
        billboard.setTextColor(this.r, this.g, this.b);
    }

    public setToBillboardBg(billboard: TextBillboardItem) {
        billboard.setBackgroundColor(this.r, this.g, this.b);
    }
}

class Player {
    public score: number;
}

class TurnBasedGame {
    protected players: Player[];
    protected activePlayer: number;

    constructor(players: Player[]) {
        this.players = players;
    }

    public start() {
        this.activePlayer = 0;
        this.doPlay();
    }

    public nextPlayer() {
        this.activePlayer++;
        if (this.activePlayer == this.players.length) {
            this.activePlayer = 0;
        }
        this.doPlay();
    }

    protected doPlay() {
    }
}

class ComputerPlayer extends Player {

}

class Ball {
    private game: TicTacToe;
    private item: ShapeItem;
    public row: number;
    public col: number;

    constructor(game: TicTacToe, row: number, col: number) {
        this.game = game;
        this.row = row;
        this.col = col;
        this.item = Scene.createItem("Sphere", col, 0, 2 - row);
        this.item.setOpacity(0.6);
        let self = this;
        this.item.onActivate(function () {
            self.game.ballActivated(self);
        });
    }

    setState(state: number) {
        switch (state) {
            case 0:
                this.item.setOpacity(0.6);
                Color.WHITE.setToItem(this.item);
                break;

            case 1:
                this.item.setOpacity(1);
                Color.RED.setToItem(this.item);
                break;

            case 2:
                this.item.setOpacity(1);
                Color.BLUE.setToItem(this.item);
                break;
        }
    }
}

class TicTacToe extends TurnBasedGame {
    private states: number[][] = [];
    private balls: Ball[][] = [];
    private infoPanel: TextBillboardItem;
    private moves: number = 0;

    constructor() {
        super([new ComputerPlayer(), new Player()]);
        for (let row = 0; row < 3; row++) {
            let r = [];
            this.states.push(r);
            let b = [];
            this.balls.push(b);
            for (let col = 0; col < 3; col++) {
                this.states[row].push(0);
                this.balls[row].push(new Ball(this, row, col));
            }
        }
        this.infoPanel = Scene.createTextBillboard(-3, 4, 0);
        this.initInfoPanel();
    }

    initInfoPanel() {
        Color.BLACK.setToBillboardText(this.infoPanel);
        Color.WHITE.setToBillboardBg(this.infoPanel);
        this.infoPanel.setText("Start by clicking a ball");
    }

    protected doPlay() {
        let a = this.activePlayer;

    }

    ballActivated(ball: Ball) {
        // this.printStates();
        // l("row: " + ball.row + ", col: " + ball.col);
        // l(this.states[ball.row][ball.col]);
        if (this.states[ball.row][ball.col] != 0) return;
        ball.setState(1);
        this.states[ball.row][ball.col] = 1;
        this.moves++;
        if (this.check()) return;

        this.infoPanel.setText("Now CoSpaces thinks...");
        let self = this;
        Scene.schedule(function () {
            self.makeMove();
        }, 1);
    }

    scanAll(value: number, count: number): boolean {
        return (this.scanRow(0, value, count) || this.scanRow(1, value, count) || this.scanRow(2, value, count) ||
        this.scanCol(0, value, count) || this.scanCol(1, value, count) || this.scanCol(2, value, count) ||
        this.scanDiag(value, count));
    }

    scanRow(row: number, value: number, count: number): boolean {
        let c = 0;
        let ec = 0;
        for (let col = 0; col < 3; col++) {
            if (this.states[row][col] === value) c++;
            if (this.states[row][col] == 0) ec++;
        }
        if (count == 2) return (c === 2 && ec > 0);
        return (c >= count);
    }

    scanCol(col: number, value: number, count: number): boolean {
        let c = 0;
        let ec = 0;
        for (let row = 0; row < 3; row++) {
            if (this.states[row][col] === value) c++;
            if (this.states[row][col] == 0) ec++;
        }
        if (count == 2) return (c === 2 && ec > 0);
        return (c >= count);
    }

    scanDiag(value: number, count: number): boolean {
        return this.scanFirstDiag(value, count) || this.scanSecondDiag(value, count);
    }

    scanFirstDiag(value: number, count: number): boolean {
        let c = 0;
        let ec = 0;
        for (let row = 0; row < 3; row++) {
            if (this.states[row][row] === value) c++;
            if (this.states[row][row] == 0) ec++;
        }
        if (count == 2) return (c === 2 && ec > 0);
        return (c >= count);
    }

    scanSecondDiag(value: number, count: number): boolean {
        let c = 0;
        let ec = 0;
        for (let row = 0; row < 3; row++) {
            if (this.states[row][2 - row] === value) c++;
            if (this.states[row][2 - row] == 0) ec++;
        }
        if (count == 2) return (c === 2 && ec > 0);
        return (c >= count);
    }

    justWin() {
        for (let i = 0; i < 3; i++) {
            if (this.scanRow(i, 2, 2)) {
                if (this.winRow(i)) break;
            }
            if (this.scanCol(i, 2, 2)) {
                if (this.winCol(i)) break;
            }
            if (this.scanFirstDiag(2, 2)) {
                if (this.winFirstDiag()) break;
            }
            if (this.scanSecondDiag(2, 2)) {
                if (this.winSecondDiag()) break;
            }
        }
    }

    winRow(i): boolean {
        for (let col = 0; col < 3; col++) {
            if (this.states[i][col] == 0) {
                this.states[i][col] = 2;
                this.balls[i][col].setState(2);
                this.moves++;
                if (this.check()) {
                    return true;
                }
            }
        }
        return false;
    }

    winCol(i): boolean {
        for (let row = 0; row < 3; row++) {
            if (this.states[row][i] == 0) {
                this.states[row][i] = 2;
                this.balls[row][i].setState(2);
                this.moves++;
                if (this.check()) {
                    return true;
                }
            }
        }
        return false;
    }

    winFirstDiag(): boolean {
        for (let row = 0; row < 3; row++) {
            if (this.states[row][row] == 0) {
                this.states[row][row] = 2;
                this.balls[row][row].setState(2);
                this.moves++;
                if (this.check()) {
                    return true;
                }
            }
        }
        return false;
    }

    winSecondDiag(): boolean {
        for (let row = 0; row < 3; row++) {
            if (this.states[row][2 - row] == 0) {
                this.states[row][2 - row] = 2;
                this.balls[row][2 - row].setState(2);
                this.moves++;
                if (this.check()) {
                    return true;
                }
            }
        }
        return false;
    }

    makeMove() {
        const r = Math.floor(Math.random() * (9 - this.moves));
        let c = 0;
        if (this.scanAll(2, 2)) {
            this.justWin();
            return;
        }
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.states[row][col] == 0) {
                    c++;
                    if (c < r) continue;
                    this.states[row][col] = 2;
                    this.balls[row][col].setState(2);
                    this.moves++;
                    if (!this.check()) {
                        this.infoPanel.setText("Your turn...");
                    }
                    return;
                }
            }
        }
        this.youWon();
    }

    check() {
        if (this.scanAll(2, 3)) {
            this.iWon();
            return true;
        }
        if (this.scanAll(1, 3)) {
            this.youWon();
            return true;
        }
        if (this.moves === 9) {
            this.draw();
            return true;
        }
        return false;
    }

    draw() {
        this.infoPanel.setText("We are even this time...");
        Color.BLACK.setToBillboardText(this.infoPanel);
        Color.GREEN.setToBillboardBg(this.infoPanel);
        this.gameEnded();
    }

    youWon() {
        this.infoPanel.setText("You won!!!");
        Color.WHITE.setToBillboardText(this.infoPanel);
        Color.RED.setToBillboardBg(this.infoPanel);
        this.gameEnded();
    }

    iWon() {
        this.infoPanel.setText("CoSpaces won!!!");
        Color.WHITE.setToBillboardText(this.infoPanel);
        Color.BLUE.setToBillboardBg(this.infoPanel);
        this.gameEnded();
    }

    gameEnded() {
        let restartSign = Scene.createTextBillboard(5, 4, 0);
        restartSign.setText("Play again?");
        const self = this;
        restartSign.onActivate(function () {
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    self.states[row][col] = 0;
                    self.balls[row][col].setState(0);
                    self.moves = 0;
                    restartSign.deleteFromScene();
                    self.initInfoPanel();
                }
            }
        });
    }

    printStates() {
        for (let row = 0; row < 3; row++) {
            l(row + ":[" + this.states[row][0] + ", " + this.states[row][1] + ", " + this.states[row][2] + "]");
        }
    }
}

function l(text) {
    Space.log(text);
}

/*
 let soundTheme: Sound = Scene.loadSound("awd9ZjvOPCZqzl2s0rTAnbjInYKRRaFmpO6lorWNE89");
 soundTheme.setVolume(0.8);
 soundTheme.play(true);
 */

let game = new TicTacToe();
game.start();