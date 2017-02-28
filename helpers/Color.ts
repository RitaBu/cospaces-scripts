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