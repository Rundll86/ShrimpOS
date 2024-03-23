初始化项目且安装声明文件  
```batch
npm init -y
npm install shrimp-if --save-dev
```
**ShrimpPlugin不需要经由webpack编译，安装声明文件仅作为辅助开发。**
### 注册到插件列表
```javascript
const ShrimpIF=require("shrimp-if");
ShrimpIF.PluginList.Register({
    ID:"插件ID，不同插件可重名，内部使用ID区分。",
    Name:"显示名称",
    Version:"版本",
    Author:"作者"
});
```
`ShrimpIF` 全局对象提供了可快速生成元素的工具，来自`ShrimpIF.UI.QuickElements`  
**可用组件**
|标识符|参数表|类型|描述|
|-|-|-|-|
|PanelBox|`Title`<br>`Width`<br>`Height`|string<br>number<br>number|容器面板，可在界面中拓展ShrimpOS功能|
|Label|`Text`<br>`BigSize`<br>`Bolder`<br>`ColorCSS`|string<br>boolean<br>boolean<br>string|标签，显示文字|
|NewLine|None||换行符，只是个\<br\>组件|
|ButtonBox|`Text`<br>`SmallSize`<br>`StyleList`<br>`AfterClick`|string<br>boolean<br>Array\<ButtonStyleTypes\><br>Function\<null\>()|按钮，可使用特殊样式|
|SelectBox|`Options`<br>`Current`<br>`Title`<br>`Opened`<br>`TopValue`<br>`AfterChange`|Array\<string\><br>number<br>string<br>boolean<br>`get` number<br>Function\<null\>()|选择器，用户可查看选项并按需选择|
|PictureBox|`Source`<br>`WidthCSS`<br>`HeightCSS`<br>`Radius`|string<br>string<br>string<br>number|图片框，可使用CSS适配大小|

使用 `ShrimpIF.UI.Rendering` 将组件渲染到DOM中。其中，  
第一个参数确定组件在DOM中位置，是一个Query选择器。  
第二个参数传入被渲染的组件。  
第三个参数确定组件渲染方式，以绑定模式渲染还是附加到子元素？  
传入true为前者，反之则后者。默认为false  
```javascript
var btn=new ShrimpIF.UI.QuickElements.ButtonBox;
btn.Text="Button";
ShrimpIF.UI.Rendering("body",btn,true);
```