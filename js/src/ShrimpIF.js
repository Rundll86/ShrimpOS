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
                let res = UI.CreateHtmlElement("div", ["panel"], { width: this.Width + "vw", height: this.Height + "vw" });
                let titlel = UI.CreateHtmlElement("span", ["title"], {}, { innerText: this.Title });
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
                let res = UI.CreateHtmlElement("span", [], { color: this.ColorCSS }, { innerText: this.Text });
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
                let res = UI.CreateHtmlElement("button", [], {}, { onclick: this.AfterClick, innerText: this.Text });
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
                this.Opened = false;
                let res = UI.CreateHtmlElement("div", ["selectBox"]);
                res.onclick = () => {
                    optionscontainer.style.marginTop = this.Opened ? this.TopValue : "0px";
                    optionscontainer.style.transform = this.Opened ? "scale(1,0)" : "scale(1,1)";
                    optionscontainer.style.opacity = this.Opened ? "0" : "1";
                    this.Opened = !this.Opened;
                };
                let optionscontainer = UI.CreateHtmlElement("div", ["selectOptions"], { marginTop: this.TopValue });
                for (let i = 0; i < this.Options.length; i++) {
                    let currentoption = UI.CreateHtmlElement("div", ["selectOption"], {}, { innerText: this.Options[i] });
                    currentoption.onclick = () => {
                        this.Current = i;
                        namelabel.innerText = this.Options[this.Current];
                        this.AfterChange();
                    };
                    optionscontainer.appendChild(currentoption);
                };
                let namelabel = UI.CreateHtmlElement("span", ["selectName"], {}, { innerText: this.Current < 0 ? this.Title : this.Options[this.Current] });
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
                return UI.CreateHtmlElement("img", [], { width: this.WidthCSS, height: this.HeightCSS, borderRadius: this.Radius + "px" }, { src: this.Source });
            };
        },
        ProgressBar: class extends ShrimpElement {
            Schedule = 0;
            Width = 200;
            __generated__ = null;
            Forward(Step = 1) {
                this.Schedule += Step;
            };
            Update() {
                let cont = UI.CreateHtmlElement("div", ["progressbar"]);
                cont.style.width = this.Width + "px";
                let overlay = UI.CreateHtmlElement("div", ["overlay"]);
                let icon = UI.CreateHtmlElement("div", ["icon"]);
                overlay.appendChild(icon);
                cont.appendChild(overlay);
                this.__generated__ = overlay;
                this.FlushElement();
                return cont;
            };
            FlushElement() {
                this.__generated__.style.width = this.Width * this.Schedule * 0.01 - 5 + "px";
            };
        }
    },
    /**
     * 
     * @param {*} Name 
     * @param {*} ClassList 
     * @param {*} Style 
     * @param {*} CustomAttrs 
     * @returns {HTMLDivElement}
     */
    CreateHtmlElement(Name, ClassList = [], Style = {}, CustomAttrs = {}) {
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
    RendererContext: class {
        LastResult = [];
        RenderingTarget = null;
        Selector = "";
        Reload() {
            let newres = [];
            for (let i = 0; i < this.LastResult.length; i++) {
                let newcurrent = this.RenderingTarget.Update();
                this.LastResult[i].parentElement.insertBefore(newcurrent, this.LastResult[i]);
                this.LastResult[i].remove();
                newres.push(newcurrent);
            };
            this.LastResult = newres;
        };
        Remove() {
            for (let i = 0; i < this.LastResult.length; i++) {
                this.LastResult[i].remove();
            };
            this.LastResult = [];
        };
        constructor(RenderingTarget, Selector, LastResult = []) {
            this.RenderingTarget = RenderingTarget;
            this.Selector = Selector;
            this.LastResult = LastResult;
        };
    },
    Rendering(Query, Target, Bind = false) {
        let res = [];
        document.querySelectorAll(Query).forEach((e) => {
            let current = Target.Update();
            if (Bind) { e.innerHTML = ""; };
            e.appendChild(current);
            res.push(current);
        });
        return new this.RendererContext(Target, Query, res);
    },
    FromHtmlElement(Ele) {
        class CustomElement extends ShrimpElement {
            Update() {
                let res = Ele;
                res.appendChild(this.GetChildHTMLElement());
                return res;
            };
        };
        return CustomElement;
    }
};
const PluginList = {
    __content__: {},
    __onlyone__: false,
    get __namelist__() {
        return Object.keys(this.__content__);
    },
    Register(ID, RequirePlugin = [], Name = "UnkownPlugin", Version = "1.0.0", Author = "Everyone", Description = "A plugin.") {
        if (!ID) {
            throw (
                new Error("Cannot register plugin.")
            );
        };
        for (let i = 0; i < RequirePlugin.length; i++) {
            if (!this.__namelist__.includes(RequirePlugin[i])) {
                throw (
                    new Error(`Plugin [${ID}(${Name})] requires plugin [${RequirePlugin[i]}].`)
                );
            };
        };
        if (this.__onlyone__) {
            throw (
                new Error("Only one plugin can be registered for a file.")
            );
        };
        this.__onlyone__ = true;
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
const Message = {
    MessageBox: class extends ShrimpElement {
        Color = MsgBoxColors.Info;
        Title = "Message";
        __generated__ = null;
        Position = [100, 100];
        Update() {
            let res = UI.CreateHtmlElement("div", ["msgbox-p"], {
                backgroundColor: this.Color[1],
                boxShadow: `0px 0px 15px ${this.Color[0]}`
            });
            res.style.setProperty("--px", this.Position[0] + "px");
            res.style.setProperty("--py", this.Position[1] + "px");
            let titlebar = UI.CreateHtmlElement("div", ["title"], { backgroundColor: this.Color[0] });
            let contentbar = UI.CreateHtmlElement("div", [], { padding: "10px" });
            contentbar.appendChild(this.GetChildHTMLElement());
            titlebar.innerText = this.Title;
            res.appendChild(titlebar);
            res.appendChild(contentbar);
            this.__generated__ = res;
            requestAnimationFrame(() => {
                this.Show();
            });
            return res;
        };
        Show() {
            this.__generated__.style.animationName = "msgboxopen";
        };
    },
    Show(Color, Content, Title) {
        let res = new this.MessageBox();
        res.Color = Color;
        res.Append((typeof Content === "string") ? new (UI.FromHtmlElement(UI.CreateHtmlElement("span", [], {}, { innerText: Content }))) : Content);
        res.Title = Title;
        res.Position = [
            Toolbox.RandomInt(100, 1000),
            Toolbox.RandomInt(100, 700)
        ];
        UI.Rendering("body", res);
        return res;
    }
};
const MsgBoxColors = {
    Info: ["#008000", "#005000"],
    Warning: ["#ffa500", "#b67600"],
    Error: ["#ff0000", "#aa0000"],
    FatalError: ["#660000", "#330000"]
};
const Toolbox = {
    RandomInt(Min, Max) {
        return Math.floor(Math.random() * (Max - Min + 1)) + Min;
    }
};
const ShrimpIF = { AI, MsgTypes, UI, ButtonStyleTypes, PluginList, Message, MsgBoxColors, Toolbox };
module.exports = window["ShrimpIF"] = ShrimpIF;