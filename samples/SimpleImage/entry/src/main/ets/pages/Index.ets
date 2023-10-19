import image from '@ohos.multimedia.image';  // napi


@Entry
@Component
struct Index {
  @State pixelMap: PixelMap = undefined;
  pixelMapCache: PixelMap = undefined;
  imagePath: string = 'null';
  idx: number = 0;
  maxCnt: number = 5;
  @State scaleFactor: number = 1.0

  aboutToAppear() {
    this.idx = 1;
    this.imagePath = '/var/image/' + this.idx + '.jpeg' // +
    this.getPixelMap(this.imagePath).then((pm)=>{
      this.scaleFactor = 1.0
      this.pixelMap = pm;
    })

  }

  async scale_up_pixelmap() {
    this.scaleFactor = this.scaleFactor * 1.06
  }

  async scale_down_pixelmap() {
    this.scaleFactor = this.scaleFactor * 0.95
  }

  async rotate_pixelmap() {
    this.pixelMap.rotate(90)
  }

  flushPixelMap() {
    let tmp = this.pixelMap;
    this.pixelMap = undefined;
    this.pixelMap = tmp;
  }

  async getResourceFd(imgUri: string) {
    const resourceMgr = getContext(this).resourceManager;
    let pictureFd: number = 0;
    const descriptor = await resourceMgr.getRawFd(imgUri);
    pictureFd = descriptor?.fd;
    return pictureFd;
  }

  async getPixelMapByFd(imgUri: string) {
    const fd = await this.getResourceFd(imgUri);
    const imageSourceApi = image.createImageSource(fd);
    if (!imageSourceApi) {
      return;
    }
    const pixelMap = await imageSourceApi.createPixelMap({
      editable: true
    });
    return pixelMap;
  }

  async getPixelMap(imgUri: string) {
    const imageSourceApi = image.createImageSource(imgUri);
    if (!imageSourceApi) {
      return;
    }
    const pixelMap = await imageSourceApi.createPixelMap({
      editable: true
    });
    return pixelMap;
  }

  build() {
    Column() {

    Column() {
      Row(){
        Image($r('app.media.min_pre'))
          .objectFit(ImageFit.None).width('10%')
          .onClick(() => {
            this.idx--
            if (this.idx < 1) {
              this.idx = this.maxCnt
            }
            this.imagePath =  '/var/image/' + this.idx + '.jpeg' //'/sdcard/image/' +
            this.getPixelMap(this.imagePath).then((pm)=>{
                this.scaleFactor = 1.0
                this.pixelMap = pm;
            })
          })
        Image(this.pixelMap)
          .alt($r('app.media.app_icon'))
          .objectFit(ImageFit.None).width('80%')
          .scale({x:this.scaleFactor, y:this.scaleFactor})
        Image($r('app.media.min_next'))
          .objectFit(ImageFit.None).width('10%')
          .onClick(() => {
            this.idx++;
            if (this.idx > this.maxCnt) {
              this.idx = 1;
            }
            this.imagePath =  '/var/image/' + this.idx + '.jpeg' //'/sdcard/image/' +
            this.getPixelMap(this.imagePath).then((pm)=>{
              this.scaleFactor = 1.0
              this.pixelMap = pm;
            })
          })

      }.alignItems(VerticalAlign.Center).height('100%')

    }.height('90%')


    Stack({alignContent : Alignment.Bottom}) {
      Row() {
        Blank().width('30%')
          Image($r('app.media.rotate')).width('10%').objectFit(ImageFit.ScaleDown)
            .onClick(()=>{

              this.rotate_pixelmap().then(()=>{
                this.flushPixelMap()
                this.pixelMap.getImageInfo().then((info)=>{
                })
              })
            })

        Blank().width('5%')

        Image($r('app.media.min_zomm_in')).width('10%').objectFit(ImageFit.ScaleDown)
          .onClick(()=>{
            this.scale_down_pixelmap().then(()=>{
              this.pixelMap.getImageInfo().then((info)=>{
              })
            })
          })
        Blank().width('5%')

        Image($r('app.media.min_zoom_out')).width('10%').objectFit(ImageFit.ScaleDown)
        .onClick(()=>{
           this.scale_up_pixelmap().then(()=>{
             this.pixelMap.getImageInfo().then((info)=>{
             })
          })
        })

        Blank().width('30%')

      }
      .width('100%')
      .height('100%')
    }
    .width('100%')
    .height('8%')
    .backgroundColor(Color.White)

    }.height('100%')
  }
}