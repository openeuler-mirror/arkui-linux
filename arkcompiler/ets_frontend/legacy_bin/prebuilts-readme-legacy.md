# legacy binary构建说明

```bash
# 获取代码
repo init -u git@gitee.com:openharmony/manifest.git -b OpenHarmony-3.1-Release --no-repo-verify
repo sync -c
repo forall -c 'git lfs pull'

# 安装依赖
./build/prebuilts_download.sh

# 编译目标
./build.sh --product-name ohos-sdk

# 获取产物
cd out/sdk/packages/ohos-sdk
```
