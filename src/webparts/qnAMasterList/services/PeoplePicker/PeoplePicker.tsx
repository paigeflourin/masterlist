/* tslint:disable */
import * as React from 'react';
import { sp } from "@pnp/sp";
/* tslint:enable */
import { BaseComponent, assign } from 'office-ui-fabric-react/lib/Utilities';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import {
  IBasePickerSuggestionsProps,
  IBasePicker,
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.types';
import { people, mru } from '../../services/PeoplePickerExampleData';
import { Promise } from 'es6-promise';
import { IPeoplePickerState, IPeoplePickerProps } from './IPeoplePickerProps';
import { SharePointUserPersona,IEnsurableSharePointUser } from '../../models/IPeoplePicker';

export class PeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {

  constructor(props:  IPeoplePickerProps) {
    super(props);
    const peopleList: IPersonaWithMenu[] = [];
    //people is the data
    people.forEach((persona: IPersonaProps) => {
      const target: IPersonaWithMenu = {};

      assign(target, persona);
      peopleList.push(target);
    });

    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList: peopleList,
      mostRecentlyUsed: mru,
      currentSelectedItems: []
    };
  }

  public componentDidMount():void {

  }

  public render() {

    return (
      <div>
        <NormalPeoplePicker
            onResolveSuggestions={this.onResolveSuggestions}
            getTextFromItem={(persona: IPersonaProps) => persona.text}
            className={'ms-PeoplePicker'}
            key={'normal'}
            //onRemoveSuggestion={this._onRemoveSuggestion}
            onValidateInput={this._validateInput}
            removeButtonAriaLabel={'Remove'}
            inputProps={{
            onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
            onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
            'aria-label': 'People Picker'
            }}
            onInputChange={this._onInputChange}
            resolveDelay={300}
        />
      </div>
    );
  }

  private onResolveSuggestions(filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) {
    console.log("in onresolve suggestions");
    if (filterText) {
        if (filterText.length > 2) {
            return this.search(filterText);
        }
    } else {
        return [];
    }
  }
  private search(term: string): Promise<SharePointUserPersona[]> {
    term = "admin-ptangalin@CUPDev.onmicrosoft.com";
    const queryParams = {
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        AllUrlZones: false,
        MaximumEntitySuggestions: 5,
        PrincipalSource: 15,
        PrincipalType: 1,
        QueryString: term
    };

    return new Promise<SharePointUserPersona[]>((resolve, reject) =>
        sp.profiles.clientPeoplePickerSearchUser(queryParams)
            .then((entries) => {
               console.log("entries", entries);
                if (entries.length > 0) {
                    const persons = entries.map((p) => new SharePointUserPersona(p as IEnsurableSharePointUser));
                    resolve(persons);
                } else if (this.isEmail(term)) {
                    const user: IEnsurableSharePointUser = {
                        Key: '',
                        EntityData: {
                            Email: term,
                            Title: '',
                            Department: ''
                        },
                        DisplayText: term
                    };
                    resolve([new SharePointUserPersona(user)]);
                } else {
                    resolve([]);
                }
            }
                , (error: any): void => {
                    reject([]);
                }));
  }

  private isEmail(search: string): boolean {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(search);
  } 

  private _returnMostRecentlyUsed = (currentPersonas: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
    return this._filterPromise(mostRecentlyUsed);
  };

  private _filterPromise(personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

  private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
  }

  private _filterPersonasByText(filterText: string): IPersonaProps[] {
    return this.state.peopleList.filter(item => this._doesTextStartWith(item.text as string, filterText));
  }

  private _doesTextStartWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
    return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

  private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
    return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }

  private _validateInput = (input: string): ValidationState => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  };

  /**
   * Takes in the picker input and modifies it in whichever way
   * the caller wants, i.e. parsing entries copied from Outlook (sample
   * input: "Aaron Reid <aaron>").
   *
   * @param input The text entered into the picker.
   */
  private _onInputChange(input: string): string {
    const outlookRegEx = /<.*>/g;
    const emailAddress = outlookRegEx.exec(input);

    if (emailAddress && emailAddress[0]) {
      return emailAddress[0].substring(1, emailAddress[0].length - 1);
    }

    return input;
  }
}