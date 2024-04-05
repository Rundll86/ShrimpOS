declare module "shrimp-if" {
    export enum MsgTypes {
        TEXT,
        PICTURE,
        CODE
    }
    export class AI {
        MessageType: MsgTypes;
        UseWeb: boolean;
        AnswerEnd: boolean;
        get ModelName(): string;
        constructor(CreateNew: boolean, ConverID: number);
        Send(Msg: string, Callback: ((Msg: string, End: boolean) => {})): void;
        static SetApiKey(Key: string): void;
        static GetQuota(): Promise<number>;
    }
    export class ShrimpElement {
        ChildList: Array<ShrimpElement>;
        Update(): HTMLElement;
        Append(Target: ShrimpElement): void;
        GetChildHTMLElement(): HTMLDivElement;
    }
    export enum ButtonStyleTypes {
        HoverWithBorder,
        HoverWithoutFlushBar,
        HeightBorderBar
    }
    export namespace UI {
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
            class ProgressBar extends ShrimpElement {
                Schedule: number;
                Width: number;
                Forward(Step: number): void;
                FlushElement(): void;
            }
        }
        namespace Style {
            function LoadFile(Path: string): void;
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
    export namespace PluginList {
        function Register(ID: string, RequirePlugin?: Array<string>, Name?: string, Version?: string, Author?: string, Description?: string): void;
        function Read(ID: string): { Name: string, Version: string, Author: string, Description: string };
        function Remove(ID: string): void;
    }
    export namespace Message {
        class MessageBox extends ShrimpElement {
            Color: MsgBoxColors | MessageBox;
            Title: string;
            Position: [number, number];
            Show(): void;
            Hide(): void;
        }
        function Show(Color: MsgBoxColors, Content: ShrimpElement, Title: string): MessageBox;
    }
    export enum MsgBoxColors {
        Info,
        Warning,
        Error,
        FatalError
    }
    export namespace Toolbox {
        function RandomInt(Min: number, Max: number): number;
        function GetFilePath(Rel: string): string;
    }
    export namespace UserInfo {
        const Name: string;
        const ApiKey: string;
        const AvatarPath: string;
    }
};