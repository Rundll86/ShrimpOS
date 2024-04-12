const ShrimpIF = require("shrimp-if");
ShrimpIF.PluginList.Register("my-plugin");
ShrimpIF.PublicDB.Register("abcd", "aaa");
ShrimpIF.PublicDB.Register("testtets", () => {
    console.log("hello world!");
});
console.log(ShrimpIF);
var panel = new ShrimpIF.UI.QuickElements.PanelBox;
var progressbar = new ShrimpIF.UI.QuickElements.ProgressBar;
var btn = new ShrimpIF.UI.QuickElements.ButtonBox;
btn.Text = "+10";
btn.AfterClick = () => {
    progressbar.Forward(10);
    progressbar.FlushElement();
};
var btn2 = new ShrimpIF.UI.QuickElements.ButtonBox;
btn2.Text = "-10";
btn2.AfterClick = () => {
    progressbar.Forward(-10);
    progressbar.FlushElement();
};
progressbar.Schedule = 0;
panel.Append(progressbar);
panel.Append(btn);
panel.Append(btn2);
var renderer = ShrimpIF.UI.Rendering("#controlbar", panel);