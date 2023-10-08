class RingAttribute {
  radius: number = 45;                                  // 圆环半径，默认45
  width: number  = 5;                                   // 圆环宽度，默认5
  color:Color | number | string | Resource = '#000000'; // 圆环颜色，默认黑色
  solid:Color | number | string | Resource = '#ffffff'; // 填充颜色，默认白色
  /**
   * 对非法参数进行过滤
   */
  public static filter(ringAttribute: RingAttribute): RingAttribute {
    if (null == ringAttribute || undefined == ringAttribute) {
      ringAttribute = new RingAttribute();
    } else {
      var defaultAttribute: RingAttribute = new RingAttribute();
      if (undefined == ringAttribute.color) {
        ringAttribute.color = defaultAttribute.color;
      }
      if (undefined == ringAttribute.width) {
        ringAttribute.width = defaultAttribute.width;
      }
      if (undefined == ringAttribute.radius) {
        ringAttribute.radius = defaultAttribute.radius;
      }
      if (undefined == ringAttribute.solid) {
        ringAttribute.solid = defaultAttribute.solid;
      }
    }
    return ringAttribute;
  }
}

// @ts-ignore
@Component export struct Ring {
  public ringAttribute: RingAttribute = null;
  build() {
    Stack({alignContent: Alignment.Center}) {
      Circle()
        .width('100%')
        .height('100%')
        .fill(this.ringAttribute.color)

      Circle()
        .width((this.ringAttribute.radius * 2 - this.ringAttribute.width))
        .height((this.ringAttribute.radius * 2 - this.ringAttribute.width))
        .fill(this.ringAttribute.solid)
    }
    .width(this.ringAttribute.radius * 2)
    .height(this.ringAttribute.radius * 2)
  }

  /**
   * 该方法在build方法执行前先执行，我们可以在这里对参数进行校验
   */
  private aboutToAppear() {
    this.ringAttribute = RingAttribute.filter(this.ringAttribute);
  }
}