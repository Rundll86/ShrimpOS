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
|标识符|参数表|类型|描述|
|-|-|-|-|
|PanelBox|`Title`<br>`Width`<br>`Height`|string<br>number<br>number|容器面板，可在界面中拓展ShrimpOS功能|
|Label|`Text`<br>`BigSize`<br>`Bolder`<br>`ColorCSS`|string<br>boolean<br>boolean<br>string|标签，显示文字|
|NewLine|None||换行符，只是个\<br\>组件|
|ButtonBox|`Text`<br>`SmallSize`<br>`StyleList`<br>`AfterClick`|string<br>boolean<br>Array\<ButtonStyleTypes\><br>Function\<null\>()|按钮，可使用特殊样式|
|SelectBox|`Options`<br>`Current`<br>`Title`<br>`Opened`<br>`TopValue`<br>`AfterChange`|Array\<string\><br>number<br>string<br>boolean<br>`get` number<br>Function\<null\>()|选择器，用户可查看选项并按需选择|
|PictureBox|`Source`<br>`WidthCSS`<br>`HeightCSS`<br>`Radius`|string<br>string<br>string<br>number|图片框，可使用CSS适配大小|
测试