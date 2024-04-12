初始化项目且安装声明文件  
```batch
npm init -y
npm install shrimp-if
```
<u>**_ShrimpPlugin不需要经由webpack编译，安装声明文件仅作为辅助开发。_**</u>  
<u>**_导入声明文件必须使用 `require` 函数导入而非 `import from`！_**</u>  
<u>**_ShrimpIF加载插件时对 `require` 函数做了特殊处理，如果脚本中需要导入非 `ShrimpIF` 的其他模块，请使用Webpack编译单文件Bundle！_**</u>

### 注册到插件列表
```js
const ShrimpIF=require("shrimp-if");
ShrimpIF.PluginList.Register(
    ID="插件ID，不同插件可重名，内部使用ID区分。",
    RequirePlugin=[
        "需求的前置插件ID"
    ],
    Name="显示名称",
    Version="版本",
    Author="作者"
);
```
### 编写用户界面
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

ShrimpIF内置组件较少，所以提供了接口使开发者可自定义组件。  
来自 `ShrimpIF.ShrimpElement` 类，继承此类可自定义开发。
```javascript
class MyElement extends ShrimpIF.ShrimpElement{
    Update(){
        //组件刷新时生成逻辑，覆写此方法实现自定义组件
        
        this.GetChildHTMLElement();
        //此方法可依照当前组件的子组件列表递归生成它们的HTML元素对象，不要覆写

        return Result;
        //生成结果应是一个HTML元素对象
    }
}
```
然而，开发者可直接使用HTML元素来生成自定义组件。  
来自 `ShrimpIF.UI.FromHtmlElement` 函数，向其参数传入一个HTML元素的名称，可自动生成一个自定义组件，此组件更新时会直接生成这个HTML元素对象而不做其他处理。仅适用于基于原版HTML元素的功能，要实现自定义逻辑请使用上述方法。

使用 `ShrimpIF.UI.Rendering` 将组件渲染到DOM中。其中，  
第一个参数确定组件在DOM中位置，是一个Query选择器。  
第二个参数传入被渲染的组件。  
第三个参数确定组件渲染方式，以绑定模式渲染还是附加到子元素？  
传入true为前者，反之则后者。默认为false  
```js
var btn=new ShrimpIF.UI.QuickElements.ButtonBox;
btn.Text="Button";
ShrimpIF.UI.Rendering("body",btn,true);
```
此 `Rendering` 函数成功将组件渲染到DOM中后将返回一个工具对象，其包括 `Elements` 数组与 `Reload` 函数，`Elements` 数组中包含了此次渲染所生成成功的HTML元素对象，然而，当修改了组件对象的属性时，更改并不会自动同步到DOM中，此时调用 `Reload` 函数即可手动将更改同步到DOM中。
### 使用ShrimpAI
此AI模型使用了[ChatNio](https://chatnio.net)网站所提供的API，在此郑重感谢。  
由于网站运营费用问题，调用API需要消耗点数，请前往网站自行购买点数，价格是便宜的。网站由国人纯自研，这样优秀的项目是值得支持的！

使用AI需要设定ApiKey，可在ChatNio网站中获取，方法与OpenAI类似。接下来使用 `SetApiKey` 方法初始化。
```js
ShrimpIF.AI.SetApiKey("你的ApiKey");
/* 要获取用户信息提供的ApiKey，使用ShrimpIF.UserInfo.ApiKey */
```
来自 `ShrimpIF.AI` 类可初始化一个GPT聊天连接，构造参数第一项为 `boolean` 类型，当传入true时将创建一个新的聊天连接，反之连接到一个已有的聊天，当参数为false时则需要传入第二个参数，为现有聊天的ID。
```js
new ShrimpIF.AI(true); //创建新连接
new ShrimpIF.AI(false,1); //连接到已有聊天
```
消息类型可通过 `MessageType` 设置，其是一个枚举常量类型，可在 `ShrimpIF.MsgTypes` 中取值。如果这些常量中没有需要的模型，也可直接向其赋值想要的模型名称。
```js
let my_chatgpt=new ShrimpIF.AI;
my_chatgpt.MessageType=ShrimpIF.MsgTypes.TEXT; //文字类型，使用gpt-3.5-turbo-1106
my_chatgpt.MessageType=ShrimpIF.MsgTypes.CODE; //代码类型，使用llama-2-13b
my_chatgpt.MessageType=ShrimpIF.MsgTypes.PICTURE; //图像类型，使用gpt-4-all
my_chatgpt.MessageType="custom-model-name"; //然而，模型名称必须遵循ChatNio字典
```
可通过 `UseWeb` 设置是否允许AI搜索互联网信息，为 `boolean` 类型。  
可获取 `AnswerEnd` 检查上一次提问是否已回答完毕，为 `boolean` 类型。

使用方法 `Send` 发送消息向AI提问，第一个参数传入消息，第二个参数传入回调函数，每当AI回复一个关键词时，此回调函数将会被调用，回调函数的第一个参数为此次回复的关键词，第二个参数为此次回复是否已完毕。
```js
let my_chatgpt=new ShrimpIF.AI;
my_chatgpt.MessageType=ShrimpIF.MsgTypes.TEXT;
my_chatgpt.Send("你好！",(kw,end)=>{
    console.log(kw);
    if(end){
        console.log("回答完毕！");
    };
});
```

使用静态方法 `GetQuota` 获取当前账户的点数剩余量，方法包含 `async` 标记，需要在异步作用域中才能正常调用。
```js
async function load_quota(){
    console.log(await ShrimpIF.AI.GetQuota());
};
```
### 重点消息框
使用 `Message` 模块显示消息框，其中 `MessageBox` 类为消息框的自定义组件，直接创建实例可自定义消息框。
```js
let a_msgbox=new ShrimpIF.Message.MessageBox;
a_msgbox.Color=["Light","Dark"]; //其中，Light作为明亮颜色，Dark作为较暗颜色，可从MsgBoxColors中取值
a_msgbox.Title="标题";
a_msgbox.Position=[]; //位置，需求2维向量
ShrimpIF.UI.Rendering("body",a_msgbox); //把消息框附加到body进行渲染
/* a_msgbox.Hide() 可隐藏消息框
   a_msgbox.Show() 反之 */
```
每次创建消息框再渲染将会很麻烦，使用 `MessageBox.Show` 函数快速显示消息。
```js
ShrimpIF.Message.Show([/* 颜色 */],"文字内容 或 自定义组件","标题");
```
如果这条函数无法渲染需求的消息样式，也可直接将消息框组件传入第一个参数。
```js
ShrimpIF.Message.Show(new ShrimpIF.Message.MessageBox);
```
### 用户信息公开
从 `UserInfo` 对象中可取得用户的可公开信息。
```js
let userName=ShrimpIF.UserInfo.Name; //用户名
let userAvatarPath=ShrimpIF.UserInfo.AvatarPath; //用户头像地址
let userApiKey=ShrimpIF.UserInfo.ApiKey; //用户的ChatNio-ApiKey
```
### 使用其他模块
<u>**_此处不是指可以直接调用Node模块！这不可能实现。_**</u>  
在插件工作目录初始化NPM并安装Webpack。
```batch
npm init -y
npm install shrimp-if webpack webpack-cli
```
创建Webpack配置文件并设置你需要的配置，此处不再赘述。  
使用NPM安装其他模块，最后使用Webpack编译！
```batch
npm install jquery
```
记得将编译脚本写入NPM Script。
```json
{
    ...
    "scripts": {
        "build": "webpack"
    },
    ...
}

```
此时，必须将源代码文件的后缀名改为.cjs或.ejs而不是.js，终端会自动判断可执行的js代码。
```batch
npm run build
```
### 导出可公开使用的数据
#### 注册
使用 `PublicDB` 模块可自定义导出数据供其他插件使用。
```js
ShrimpIF.PublicDB.Register("a-data", "hello world");
ShrimpIF.PublicDB.Register("hello", () => {
    console.log("hello world!");
});
```
注册公开数据前需先注册插件，否则将拒绝注册。反之请使用 `Expose` 函数直接释放到全局对象。
```js
ShrimpIF.PluginList.Register("my-plugin");
ShrimpIF.PublicDB.Register("a-data", "hello world");
ShrimpIF.PublicDB.Register("hello", () => {
    console.log("hello world!");
});

//或者

ShrimpIF.PublicDB.Expose("hello", () => {
    console.log("hello world!");
});
```
#### 导入
使用 `PublicDB.Load` 从另一插件中加载公开数据，将会返回一个对象。
```js
var MyPlugin=ShrimpIF.PublicDB.Load("my-plugin");
/* 从ID名为my-plugin的插件中获取 */
console.log(MyPlugin["a-data"]); //取得my-plugin中导出的名为a-data的数据
MyPlugin.hello(); //取得my-plugin中导出的名为hello的函数

//如果该插件使用Expose导出而非Register，可直接从全局对象取用。

hello();
```