var ShrimpIF = require("../js/node_modules/shrimp-if");
ShrimpIF.PluginList.Register("testplugin");
var panel1 = new ShrimpIF.UI.QuickElements.PanelBox;
panel1.Title = "第一个面板！";
var panel2 = new ShrimpIF.UI.QuickElements.PanelBox;
panel2.Title = "面板能嵌套";
var btn = new ShrimpIF.UI.QuickElements.ButtonBox;
btn.Text = "点我！";
panel2.Append(btn);
panel1.Append(panel2);
var mygpt=new ShrimpIF.AI;
ShrimpIF.AI.SetApiKey("abcd");
mygpt.MessageType=ShrimpIF.MsgTypes.TEXT;
mygpt.Send("你好！");
ShrimpIF.UI.Rendering("#controlbar", panel1).Reload();