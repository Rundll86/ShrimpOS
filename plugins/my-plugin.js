var ShrimpIF = require("../js/typed/index.d.ts");
var elet = ShrimpIF.UI.ElementTree;
console.log(
    elet("div", [
        elet("img", [
            elet("span"),
            elet("iframe").Attribute("src", "https://baidu.com"),
            elet("canvas")
        ]),
        elet("span", [
            elet("span")
                .Style("color", "red")
                .Attribute("innerText", "hello world")
                .Class("my-text")
        ])
    ]).Target
);
var my_panel = new ShrimpIF.UI.QuickElements.PanelBox;
my_panel.Title = "抽象图像生成器";
var my_label = new ShrimpIF.UI.QuickElements.Label;
my_label.Text = "来自";
var my_sb = new ShrimpIF.UI.QuickElements.SelectBox;
my_sb.Options = ["Genshin Impact", "Honkai: StarRail", "Zenless Zone Zero"];
my_sb.AfterChange = () => {
    if (my_sb.Current === 0) {
        my_sb2.Options = ["Wriothesley", "Neuvillette", "Alhaitham"];
    };
    if (my_sb.Current === 1) {
        my_sb2.Options = ["Dan Heng · lmbibitor Lunae", "Ren", "Herta"];
    };
    if (my_sb.Current === 2) {
        my_sb2.Options = ["Von Lycaon"];
    };
    panelrendering.Reload();
};
var pb = new ShrimpIF.UI.QuickElements.ProgressBar;
var my_label2 = new ShrimpIF.UI.QuickElements.Label;
my_label2.Text = "的";
var my_label3 = new ShrimpIF.UI.QuickElements.Label;
my_label3.Text = "正在生成...";
my_label3.ColorCSS = "transparent";
var my_sb2 = new ShrimpIF.UI.QuickElements.SelectBox;
my_sb2.Options = [];
var my_btn = new ShrimpIF.UI.QuickElements.ButtonBox;
my_btn.Text = "点击生成！";
my_btn.SmallSize = true;
my_btn.StyleList.push(ShrimpIF.ButtonStyleTypes.HoverWithoutFlushBar);
my_btn.StyleList.push(ShrimpIF.ButtonStyleTypes.HeightBorderBar);
my_btn.StyleList.push(ShrimpIF.ButtonStyleTypes.HoverWithBorder);
ShrimpIF.AI.SetApiKey(ShrimpIF.UserInfo.ApiKey);
var my_chatgpt = new ShrimpIF.AI;
my_chatgpt.MessageType = ShrimpIF.MsgTypes.PICTURE;
var lastans = "";
var my_img = new ShrimpIF.UI.QuickElements.PictureBox;
my_btn.AfterClick = () => {
    test(1)
    my_label3.ColorCSS = "white";
    my_chatgpt.Send(`画一个来自游戏《${my_sb.Options[my_sb.Current]}》的角色“${my_sb2.Options[my_sb2.Current]}”的美图`, (msg, end) => {
        console.log(msg);
        pb.Forward(1);
        pb.FlushElement()
        if (end) {
            my_label3.ColorCSS = "transparent";
            let markdownText = lastans;
            const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
            let match;
            while ((match = imageRegex.exec(markdownText)) !== null) {
                const imageUrl = match[2];
                my_img.Source = imageUrl;
            }
            panelrendering.Reload();
        }
        else {
            lastans += msg;
        };
    });
    panelrendering.Reload();
};
my_panel.Append(my_label);
my_panel.Append(my_sb);
my_panel.Append(my_label2);
my_panel.Append(my_sb2);
my_panel.Append(my_btn);
my_panel.Append(my_label3);
my_panel.Append(my_img);
my_panel.Append(pb);
var panelrendering = ShrimpIF.UI.Rendering("#controlbar", my_panel);
ShrimpIF.PluginList.Register("my-plugin");
function test(num) {
    setTimeout(() => {
        ShrimpIF.Message.Show(
            ShrimpIF.MsgBoxColors.Info,
            new (ShrimpIF.UI.FromHtmlElement(
                ShrimpIF.UI.CreateHtmlElement("span", [], {}, { innerText: "你是一个傻狍子" })
            )
            ),
            "Message"
        );
        if (num > 1) {
            test(num - 1);
        };
    }, 0);
};