import { Component, OnInit, Input, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import Portal from '@arcgis/core/portal/Portal';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import esriConfig from '@arcgis/core/config';
import { ActivatedRoute } from '@angular/router';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';


// Calcite
import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-loader';
import '@esri/calcite-components/dist/components/calcite-shell';
import '@esri/calcite-components/dist/components/calcite-shell-panel';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@esri/calcite-components/dist/components/calcite-action';
import '@esri/calcite-components/dist/components/calcite-panel';
import '@esri/calcite-components/dist/components/calcite-label';
import '@esri/calcite-components/dist/components/calcite-icon';
import '@esri/calcite-components/dist/components/calcite-switch';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private OAuthInfo: OAuthInfo;
  username = 'Niet ingelogd';
  title = 'CCR360';
  darkEnabled = false;
  theme = 'theme-brandweer';
  profile = 'Brandweer';

  constructor() {
    if (environment.esriApiKey !== '') {
      esriConfig.apiKey = environment.esriApiKey;
    }
    if (environment.portalUrl !== '') {
      esriConfig.portalUrl = environment.portalUrl;
    }

    this.OAuthInfo = new OAuthInfo({
      appId: environment.portalAppId,
      flowType: 'auto',
      popup: false,
      preserveUrlHash: true,
    });

    this.OAuthInfo.portalUrl = esriConfig.portalUrl;
    IdentityManager.registerOAuthInfos([this.OAuthInfo]);
  }

  initializeCredentials(): void {
    
    IdentityManager
      .checkSignInStatus(this.OAuthInfo.portalUrl + '/sharing')
      .then((cred: __esri.Credential) => {
        this.handleSignedIn(cred);
      })
      .catch((e) => { // not logged in yet.

        IdentityManager.getCredential(this.OAuthInfo.portalUrl + '/sharing');
      });
      
  }

  handleSignedIn(cred: __esri.Credential): void {
    //IdentityManager.setOAuthResponseHash(location.hash);
    console.log(cred);
    // console.log('ID Manager');
    // console.log(IdentityManager.toJSON());
    const portal = new Portal();
    portal.authMode = 'immediate';

    portal.load().then(() => {
      // portal.queryGroups({

      // })
      console.log(portal);
      console.log(portal.user.fullName);
      this.username = portal.user.fullName;

      // route to profile selection
    });
  }

  ngOnInit(): void {

    let activeWidget: any;

    const handleActionBarClick = ({ target }: {target:any}) => {
      if (target.tagName !== 'CALCITE-ACTION') {
        return;
      }

      if (activeWidget) {
        document.querySelector(`[data-action-id=${activeWidget}]`)!.removeAttribute('active');
        document.querySelector(`[data-panel-id=${activeWidget}]`)!.setAttribute('hidden', 'true');
      }

      const nextWidget = target.dataset.actionId;
      if (nextWidget !== activeWidget) {
        document.querySelector(`[data-action-id=${nextWidget}]`)!.setAttribute('active', 'true');
        document.querySelector(`[data-panel-id=${nextWidget}]`)!.removeAttribute('hidden');
        activeWidget = nextWidget;
      } else {
        activeWidget = null;
      }
    };

    document.querySelector('calcite-action-bar')!.addEventListener('click', handleActionBarClick);

    document.querySelector('calcite-shell')!.hidden = false;
    document.querySelector('calcite-loader')!.active = false;

    const toggleThemes = () => {
      // calcite theme
      document.body.classList.toggle('calcite-theme-dark');
      // jsapi theme
      const dark: HTMLElement = document.querySelector('#jsapi-theme-dark') as HTMLElement;
      const light: HTMLElement = document.querySelector('#jsapi-theme-light') as HTMLElement;
      // let becomesDark = dark.attributes['disabled'];
      this.darkEnabled = !this.darkEnabled;

      if (this.darkEnabled) {
        light.setAttribute('disabled', 'true');
        dark.removeAttribute('disabled');
      }
      else {
        dark.setAttribute('disabled', 'true');
        light.removeAttribute('disabled');
      }

      // jsapi basemap color

      //      this._map.basemap = this.darkEnabled ? Basemap.fromId('osm-dark-gray') : Basemap.fromId('osm');
    };

    document.querySelector('calcite-switch')!.addEventListener('calciteSwitchChange', toggleThemes);

    this.initializeCredentials();

  }
}
