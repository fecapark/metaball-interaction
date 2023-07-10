type ResizeFn = () => void;

export default class StageManager {
  private static instance: StageManager;
  private resizeFns: Array<ResizeFn>;

  public stageWidth: number;
  public stageHeight: number;

  private constructor() {
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.resizeFns = [];

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  static getInstance() {
    StageManager.instance ??= new StageManager();
    return StageManager.instance;
  }

  addResize(fn: ResizeFn) {
    this.resizeFns.push(fn);
    fn();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.resizeFns.forEach((fn) => {
      fn();
    });
  }
}
