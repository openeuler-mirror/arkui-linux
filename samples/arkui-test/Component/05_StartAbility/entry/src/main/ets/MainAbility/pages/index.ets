// 引入featureAbility
import featureAbility from '@ohos.ability.featureAbility';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'
  build() {
      Column() {
        Text(this.message)
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
          .height("40%")

        Button('open page ability')
          .onClick(() => {
            // 打开目标Ability
            featureAbility.startAbility({
              want: {
                // 目标Ability所在的bundleName，也就是config.json里配置的bundleName
                bundleName: "com.example.myapplication",
                // 目标Ability的全路径
                abilityName: "com.example.myapplication.PageAbility"
              }
            })
              .then((data) => {
                console.info('Operation successful. Data: ' + JSON.stringify(data))
              })
              .catch((error) => {
                console.error('Operation failed. Cause: ' + JSON.stringify(error));
              })
          })
      }
    .size({height: "100%", width : "100%"})
  }
}