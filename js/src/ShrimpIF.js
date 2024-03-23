const chatnio = require("chatnio");
class AI {
    MessageType = MsgTypes.TEXT;
    UseWeb = true;
    AnswerEnd = true;
    get ModelName() {
        let NameMap = [
            "gpt-3.5-turbo-1106",
            "gpt-4-all",
            "llama-2-13b"
        ];
        if (!Object.keys(NameMap).includes(this.MessageType)) { return this.MessageType; };
        return NameMap[this.MessageType];
    };
    __chatnio__ = new chatnio.Chat(-1);
    constructor(CreateNew = false, ConverID = 1) {
        if (CreateNew) {
            this.__chatnio__ = new chatnio.Chat(-1);
        }
        else {
            this.__chatnio__ = new chatnio.Chat(ConverID);
        };
    };
    Send(Msg, Callback = (Msg, End) => { }) {
        this.__chatnio__.askStream({ message: Msg, model: this.ModelName, web: this.UseWeb }, (Msg) => { Callback(Msg.message, Msg.end); this.AnswerEnd = Msg.end; });
    };
    static SetApiKey(Key) {
        chatnio.setKey(Key);
    };
    static async GetQuota() {
        return await chatnio.getQuota();
    };
};
const MsgTypes = {
    TEXT: 0,
    PICTURE: 1,
    CODE: 2
};
class ShrimpElement {
    ChildList = [];
    Update() {
        return document.createElement("div");
    };
    Append(Target) {
        this.ChildList.push(Target);
    };
    GetChildHTMLElement() {
        let res = document.createElement("div");
        for (let i = 0; i < this.ChildList.length; i++) {
            res.appendChild(this.ChildList[i].Update());
        };
        return res;
    };
};
const ButtonStyleTypes = {
    HoverWithBorder: 0,
    HoverWithoutFlushBar: 1,
    HeightBorderBar: 2
};
const UI = {
    QuickElements: {
        PanelBox: class extends ShrimpElement {
            Title = "Panel";
            Width = 15;
            Height = 20;
            Update() {
                let res = UI.HtmlElement("div", ["panel"], { width: this.Width + "vw", height: this.Height + "vw" });
                let titlel = UI.HtmlElement("span", ["title"], {}, { innerText: this.Title });
                res.appendChild(titlel);
                res.appendChild(document.createElement("br"));
                res.appendChild(document.createElement("hr"));
                res.appendChild(document.createElement("br"));
                res.appendChild(this.GetChildHTMLElement());
                return res;
            };
        },
        Label: class extends ShrimpElement {
            Text = "LabelText";
            BigSize = false;
            Bolder = false;
            ColorCSS = "white";
            Update() {
                let res = UI.HtmlElement("span", [], { color: this.ColorCSS }, { innerText: this.Text });
                if (this.BigSize) { res.style.fontSize = "20px"; };
                if (this.Bolder) { res.style.fontWeight = "bold" };
                return res;
            };
        },
        NewLine: class extends ShrimpElement {
            Update() {
                return document.createElement("br");
            }
        },
        ButtonBox: class extends ShrimpElement {
            Text = "Button";
            AfterClick() { };
            StyleList = [];
            SmallSize = false;
            Update() {
                let res = UI.HtmlElement("button", [], {}, { onclick: this.AfterClick, innerText: this.Text });
                const styletocn = [
                    "hoverPlus",
                    "hoverButBlock",
                    "heightBorder"
                ];
                for (let i = 0; i < this.StyleList.length; i++) {
                    res.classList.add(styletocn[this.StyleList[i]]);
                };
                if (this.SmallSize) { res.classList.add("small"); };
                return res;
            };
        },
        SelectBox: class extends ShrimpElement {
            Options = [];
            Current = -1;
            Title = "ClickToSelect";
            Opened = false;
            AfterChange() { };
            get TopValue() {
                return (this.Options.length * -22 - 1) + "px";
            };
            Update() {
                let res = UI.HtmlElement("div", ["selectBox"]);
                res.onclick = () => {
                    optionscontainer.style.marginTop = this.Opened ? this.TopValue : "0px";
                    optionscontainer.style.transform = this.Opened ? "scale(1,0)" : "scale(1,1)";
                    optionscontainer.style.opacity = this.Opened ? "0" : "1";
                    this.Opened = !this.Opened;
                };
                let optionscontainer = UI.HtmlElement("div", ["selectOptions"], { marginTop: this.TopValue });
                for (let i = 0; i < this.Options.length; i++) {
                    let currentoption = UI.HtmlElement("div", ["selectOption"], {}, { innerText: this.Options[i] });
                    currentoption.onclick = () => {
                        this.Current = i;
                        namelabel.innerText = this.Options[this.Current];
                        this.AfterChange();
                    };
                    optionscontainer.appendChild(currentoption);
                };
                let namelabel = UI.HtmlElement("span", ["selectName"], {}, { innerText: this.Current < 0 ? this.Title : this.Options[this.Current] });
                res.appendChild(namelabel);
                res.appendChild(optionscontainer);
                return res;
            };
        },
        PictureBox: class extends ShrimpElement {
            Source = "";
            WidthCSS = "100%";
            HeightCSS = "auto";
            Radius = 5;
            Update() {
                return UI.HtmlElement("img", [], { width: this.WidthCSS, height: this.HeightCSS, borderRadius: this.Radius + "px" }, { src: this.Source });
            };
        }
    },
    HtmlElement(Name, ClassList = [], Style = {}, CustomAttrs = {}) {
        let res = document.createElement(Name);
        for (let i = 0; i < ClassList.length; i++) {
            res.classList.add(ClassList[i]);
        };
        let stylekeys = Object.keys(Style);
        for (let i = 0; i < stylekeys.length; i++) {
            res.style[stylekeys[i]] = Style[stylekeys[i]];
        };
        let cusattrskeys = Object.keys(CustomAttrs);
        for (let i = 0; i < cusattrskeys.length; i++) {
            res[cusattrskeys[i]] = CustomAttrs[cusattrskeys[i]];
        };
        return res;
    },
    Rendering(Query, Target, Bind = false) {
        let res = [];
        document.querySelectorAll(Query).forEach((e) => {
            let current = Target.Update();
            if (Bind) { e.innerHTML = ""; };
            e.appendChild(current);
            res.push(current);
        });
        return {
            Elements: res,
            Reload() {
                for (let i = 0; i < this.Elements.length; i++) {
                    this.Elements[i].remove();
                };
                this.Elements = UI.Rendering(Query, Target, Bind).Elements;
            }
        };
    },
    FromHtmlElement(Name) {
        class CustomElement extends ShrimpElement {
            Update() {
                let res = document.createElement(Name);
                res.appendChild(this.GetChildHTMLElement());
                return res;
            };
        };
        return CustomElement;
    }
};
UI.ShrimpElement = ShrimpElement;
const PluginList = {
    __content__: {},
    Register({ ID, Name = "UnkownPlugin", Version = "1.0.0", Author = "Everyone", Description = "A plugin." }) {
        if (!ID) {
            throw new Error("Cannot register plugin.");
        };
        if (Object.keys(this.__content__).includes(ID)) { this.Remove(ID); };
        this.__content__[ID] = [Name, Version, Author, Description];
    },
    Read(ID) {
        let res = this.__content__[ID];
        return {
            Name: res[0],
            Version: res[1],
            Author: res[2],
            Description: res[3]
        };
    },
    Remove(ID) {
        delete this.__content__[ID];
    }
};
const ShrimpIF = { AI, MsgTypes, UI, ButtonStyleTypes, PluginList };
module.exports = window["ShrimpIF"] = ShrimpIF;