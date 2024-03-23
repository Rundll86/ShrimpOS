初始化项目且安装声明文件  
```batch
npm init -y
npm install shrimp-if --save-dev
```
**ShrimpPlugin不需要经由webpack编译，安装声明文件仅作为辅助开发。**
### 注册到插件列表
```javascript
const ShrimpIF = require("shrimp-if");
ShrimpIF.PluginList.Register({
    ID:"插件ID，不同插件可重名，内部使用ID区分。",
    Name:"显示名称",
    Version:"版本",
    Author:"作者"
});
```
可用组件
|标识符|参数表|描述|
|-|-|-|
|PanelBox|`Title[string]`,`Width[number]`,`Height[number]`|容器面板，可在界面中拓展ShrimpOS功能|
|Label|`Text[string]`,`BigSize[boolean]`,`Bolder[boolean]`,`ColorCSS[string]`||
|NewLine|None||
|ButtonBox|`Text[string]`,`SmallSize[boolean]`,`StyleList[Array<ButtonStyleTypes>]`,`AfterClick[Function<null>]()`||
|SelectBox|`Options[Array<string>]`,`Current[number]`,`Title[string]`,`Opened[boolean]`,`TopValue[string]`,`AfterChange[Function<null>]()`||
|PictureBox|`Source[string]`,`WidthCSS[string]`,`HeightCSS[string]`,`Radius[number]`||