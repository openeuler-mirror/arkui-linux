@Entry
@Component
struct Index {

  @State skin: number = 0;

  @State counter: number = 0

  @State _translate: TranslateOptions = {
    x: 0,
    y: -600,
    z: 0
  }

  @State _scale: ScaleOptions  = {
    x: 1,
    y: 1,
    z: 1
  }

  @State _opacity: number = 0;

  step1(){}
  step2(){}

  // 单步动画执行函数
  animationStep(value: AnimateParam, event: () => void) {
    return () => {
      return new Promise((resolve) => {
        let onFinish = value.onFinish
        value.onFinish = () => {
          if(onFinish) onFinish()
          resolve(true)
        }
        animateTo(value, event)
      })
    }
  }

  // 多步动画
  aboutToAppear() {
    // 每步动画执行时长
    let time = 200
    this.step1 = this.animationStep({
      duration: time, // 动画时长
      tempo: 0.5, // 播放速率
      curve: Curve.EaseInOut, // 动画曲线
      delay: 0, // 动画延迟
      iterations: 1, // 播放次数
      playMode: PlayMode.Normal, // 动画模式
      onFinish: () => {
        // 动画执行完成
        console.info('play end')
      }
    }, () => {
      //闭包内更改状态
      this._translate = {
        x: 0,
        y: -650,
        z: 0
      },
      this._scale = {
        x: 0.80,
        y: 0.80,
        z: 0.80
      },
      this._opacity = 1;
    })

    this.step2 = this.animationStep({
      duration: 0, // 动画时长
      tempo: 0.5, // 播放速率
      curve: Curve.EaseInOut, // 动画曲线
      delay: 0, // 动画延迟
      iterations: 1, // 播放次数
      playMode: PlayMode.Normal, // 动画模式
      onFinish: () => {
        // 动画执行完成
        console.info('play end')
      }
    }, () => {
      //闭包内更改状态
      this._translate = {
        x: 0,
        y: -600,
        z: 0
      },
      this._scale = {
        x: 1,
        y: 1,
        z: 1
      },
      this._opacity = 0;
    })
  }


  // start
  build() {
    Row() {

      Column() {

        Column() {
          Text(this.skin==0?'一只敲木鱼':'一只敲木"余"')
            .fontSize(50)
            .fontColor('white')
        }
        .margin({top: '15%'})
        .width('100%')

        Column() {
          if (this.skin == 0) {
            Image($r('app.media.woodfish1'))
              .margin({top: '-20%'})
              .align(Alignment.TopStart)
              .objectFit(ImageFit.Contain)
              .onClick(async () => {
                await this.counter++
                await this.step1()
                await this.step2()
              })
          } else {
            Image($r('app.media.mate60pro'))
              .margin({top: '-20%'})
              .align(Alignment.TopStart)
              .objectFit(ImageFit.Contain)
              .onClick(async () => {
                await this.counter++
                await this.step1()
                await this.step2()
              })
          }

            if(this.skin == 0){
              Image($r('app.media.gongdeplus1white'))
                .translate(this._translate) // 位移变换
                .scale(this._scale)
                .opacity(this._opacity)
                .width('80%')
            }else{
              Image($r('app.media.yaoyaolingxian'))
                .translate(this._translate) // 位移变换
                .scale(this._scale)
                .opacity(this._opacity)
                .width('80%')
            }

        }
        .margin({top: '5'})
        .width('100%')
        .height('80%')


        Column() {
          if(this.skin == 0){
            Text('累积功德 : ' + (this.counter).toString())
              .fontSize(30)
              .offset({x: 0, y: -150})
          }else{
            Text('累积遥遥领先 : ' + (this.counter).toString())
              .fontSize(30)
              .offset({x: 0, y: -150})
            Text('仅供娱乐，无任何不良引导！')
              .fontSize(15)
              .offset({x: 0, y: -120})
          }

          Column() {
            Button('换肤')
              .onClick(async ()=>{
                  this.skin==0?this.skin=1:this.skin=0;
              })
              .offset({x: 0, y: -100})
          }
        }
        .margin({top: '5'})
        .width('100%')

      }
      .width('100%')
      .height('100%')
    }
    // .width('380px') //fangtian
    // .height('750px') //fangtian
    .width('100%') //device phone
    .height('100%') //device phone
    .backgroundImage($r('app.media.background'))
    .backgroundImageSize({width: '100%', height: '100%'})
  }
}

