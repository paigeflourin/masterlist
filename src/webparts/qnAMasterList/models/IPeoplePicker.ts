import { IPersonaProps, IPersona } from "office-ui-fabric-react";

export interface IUserEntityData {
    IsAltSecIdPresent?: string;
    ObjectId?: string;
    Title?: string;
    Email?: string;
    MobilePhone?: string;
    OtherMails?: string;
    Department?: string;
    LoginName?: string;
}

export interface IClientPeoplePickerSearchUser {
    Key?: string;
    Description?: string;
    DisplayText?: string;
    EntityType?: string;
    ProviderDisplayName?: string;
    ProviderName?: string;
    IsResolved?: boolean;
    EntityData?: IUserEntityData;
    MultipleMatches?: any[];
}

export interface IEnsureUser {
    Email?: string;
    Id?: number;
    IsEmailAuthenticationGuestUser?: boolean;
    IsHiddenInUI?: boolean;
    IsShareByEmailGuestUser?: boolean;
    IsSiteAdmin?: boolean;
    LoginName?: string;
    PrincipalType?: number;
    Title?: string;
    UserId?: {
        NameId: string;
        NameIdIssuer: string;
    };
}

export interface IEnsurableSharePointUser extends IClientPeoplePickerSearchUser, IEnsureUser { }

export class SharePointUserPersona implements IPersona {
    private user: IEnsurableSharePointUser;
    public get User(): IEnsurableSharePointUser {
        return this.user;
    }

    public set User(user: IEnsurableSharePointUser) {
        this.user = user;
        this.primaryText = user.DisplayText;
        this.secondaryText = user.EntityData.Title;
        this.tertiaryText = user.EntityData.Department;
        this.imageShouldFadeIn = true;
        this.imageUrl = `/_layouts/15/userphoto.aspx?size=S&accountname=${this.User.Key.substr(this.User.Key.lastIndexOf('|') + 1)}`;
        this.loginName = user.Key;
    }

    constructor(user: IEnsurableSharePointUser) {
        this.User = user;
    }

    public id: string;
    public email: string;
    public primaryText: string;
    public secondaryText: string;
    public tertiaryText: string;
    public imageUrl: string;
    public imageShouldFadeIn: boolean;
    public loginName: string;
}
