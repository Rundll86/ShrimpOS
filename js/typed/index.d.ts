declare module "shrimp-if";
declare enum MsgTypes {
    TEXT,
    PICTURE,
    CODE
}
declare class AI {
    MessageType: MsgTypes;
    UseWeb: boolean;
    AnswerEnd: boolean;
    get ModelName(): string;
    constructor(CreateNew: boolean, ConverID: number);
    Send(Msg: string, Callback: ((Msg: string, End: boolean) => {})): void;
    static SetApiKey(Key: string): void;
    static GetQuota(): Promise<number>;
}
declare class ShrimpElement {
    ChildList: Array<ShrimpElement>;
    Update(): HTMLElement;
    Append(Target: ShrimpElement): void;
    GetChildHTMLElement(): HTMLDivElement;
}
declare enum ButtonStyleTypes {
    HoverWithBorder,
    HoverWithoutFlushBar,
    HeightBorderBar
}
declare namespace UI {
    namespace QuickElements {
        class PanelBox extends ShrimpElement {
            Title: string;
            Width: number;
            Height: number;
        }
        class Label extends ShrimpElement {
            Text: string;
            BigSize: boolean;
            Bolder: boolean;
            ColorCSS: string;
        }
        class NewLine extends ShrimpElement { }
        class ButtonBox extends ShrimpElement {
            Text: string;
            AfterClick(): any;
            StyleList: Array<ButtonStyleTypes>;
            SmallSize: boolean;
        }
        class SelectBox extends ShrimpElement {
            Options: Array<string>;
            Current: number;
            Title: string;
            Opened: boolean;
            AfterChange(): any;
            get TopValue(): number;
        }
        class PictureBox extends ShrimpElement {
            Source: string;
            WidthCSS: string;
            HeightCSS: string;
            Radius: number;
        }
    }
    class RendererContext {
        LastResult: Array<HTMLElement>;
        RenderingTarget: ShrimpElement;
        Selector: string
        Reload(): void;
        Remove(): void;
        constructor(RenderingTarget: ShrimpElement, Selector: string, LastResult?: Array<HTMLElement>);
    }
    function CreateHtmlElement(Name: string, ClassList?: Array<string>, Style?: Object, CustomAttrs?: Object): HTMLElement;
    function Rendering(Query: string, Target: ShrimpElement, Bind?: boolean): RendererContext;
    function FromHtmlElement(Name: string): ShrimpElement;
}
declare namespace PluginList {
    function Register(ID: string, RequirePlugin?: Array<string>, Name?: string, Version?: string, Author?: string, Description?: string): void;
    function Read(ID: string): { Name: string, Version: string, Author: string, Description: string };
    function Remove(ID: string): void;
}
declare namespace Message {
    class MessageBox extends ShrimpElement {
        Color: MsgBoxColors;
        Title: string;
        Position: [number, number];
        Show(): void;
        Hide(): void;
    }
    function Show(Color: MsgBoxColors, Content: ShrimpElement, Title: string): MessageBox;
}
declare enum MsgBoxColors {
    Info,
    Warning,
    Error,
    FatalError
}
declare namespace Toolbox {
    function RandomInt(Min: number, Max: number): number;
}
export { AI, ShrimpElement, ButtonStyleTypes, MsgTypes, UI, PluginList, Message, MsgBoxColors, Toolbox };