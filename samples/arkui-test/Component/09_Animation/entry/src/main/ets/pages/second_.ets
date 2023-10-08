// 第二个页面
@Entry @Component struct second_ {
  // @ts-ignore
  @State scale: number = 1
  // @ts-ignore
  @State opacity: number = 1

  build() {
    Stack() {
      Navigator({target: "", type: NavigationType.Back}) {
        Image("pages/test5.jpg")
          .size({width: "100%", height: '100%'})
      }
      Text('第二个页面')
        .fontSize(26)
        .fontColor(Color.White)
    }
    .size({width: '100%', height: '100%'})
    .scale({
      x: this.scale
    })
    .opacity(this.opacity)
  }

  pageTransition() {
    PageTransitionEnter({
      duration: 1200,
      curve: Curve.Linear
    })
      .onEnter((type: RouteType, progress: number) => {
        this.scale = 1
        this.opacity = progress
      })

    PageTransitionExit({
      duration: 1500,
      curve: Curve.Ease
    })
      .onExit((type: RouteType, progress: number) => {
        this.scale = 1 - progress
        this.opacity = 1
      })
  }
}