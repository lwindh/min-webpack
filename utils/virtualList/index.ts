export default class VirtualList {
  public readonly itemSize: number = 100;

  public listData: any[] = [];

  // 可视区域高度
  public screenHeight: number =
    document.documentElement.clientHeight || document.body.clientHeight;

  // 可显示的列表项数
  public visibleCount: number = Math.ceil(this.screenHeight / this.itemSize);

  // 偏移量
  public startOffset: number = 0;
  // 起始索引
  public start: number = 0;
  // 结束索引
  public end: number = this.start + this.visibleCount;

  public $refs: {
    list: any;
  };

  // 列表总高度
  get listHeight() {
    return this.listData.length * this.itemSize;
  }

  // 偏移量对应的style
  get getTransform() {
    return `translate3d(0,${this.startOffset}px,0)`;
  }

  // 获取真实显示列表数据
  get visibleData() {
    return this.listData.slice(
      this.start,
      Math.min(this.end, this.listData.length)
    );
  }

  getTenListData() {
    if (this.listData.length >= 200) {
      return [];
    }
    return new Array(10).fill({}).map((item, index) => ({
      id: index,
      title: "",
      content: "",
    }));
  }

  created() {
    this.listData = this.getTenListData();
  }

  scrollToTop() {
    this.$refs.list.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  public scrollEvent(e: any) {
    // 当前滚动位置
    const scrollTop = this.$refs.list.scrollTop;
    // 此时的开始索引
    this.start = Math.floor(scrollTop / this.itemSize);
    // 此时的结束索引
    this.end = this.start + this.visibleCount;

    if (this.end > this.listData.length) {
      this.listData = this.listData.concat(this.getTenListData());
    }

    // 此时的偏移量
    this.startOffset = scrollTop - (scrollTop % this.itemSize);
  }
}
