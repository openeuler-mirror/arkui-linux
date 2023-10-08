@Entry @Component struct SubWindowComponent {
  build() {
    Column() {
      Text("我是子窗口")
        .fontSize(30)
    }
    .backgroundColor("#ccaabb")
    .size({width: "100%", height: "100%"})
  }
}