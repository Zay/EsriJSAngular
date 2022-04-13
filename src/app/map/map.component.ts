// Angular
import { Component, OnInit, Input } from '@angular/core';



// ArcGIS JS API
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import Portal from '@arcgis/core/portal/Portal';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import Basemap from '@arcgis/core/Basemap';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: WebMap | undefined;
  private view: MapView | undefined;

  darkEnabled = false;

  constructor() {


  }

  ngOnInit(): void {
    this.initializeMap().then(() => {
      // login
    });
  }

  initializeMap(): Promise<any> {


    // this.map = new WebMap({
    //   portalItem: {
    //     id: 'dfc07fecb0fc439bbe673cab212dd3c7',
    //   },
    // });

    const mapProps: __esri.MapProperties = {
      basemap: 'osm'
    };
    this.map = new WebMap(mapProps);

    const viewProps: __esri.MapViewProperties = {
      map: this.map,
      container: 'viewDiv',
      center: [4.4957631867295005, 52.00714073265055], // Longitude, latitude
      zoom: 13 // Zoom level
    };
    this.view = new MapView(viewProps);

    this.view.when(() => {
      console.log('Map loaded');
    });

    this.view.ui.move('zoom', 'bottom-right');
    const basemaps: BasemapGallery = new BasemapGallery({
      view: this.view,
      container: 'basemaps-container'
    });

    const layerList: LayerList = new LayerList({
      view: this.view,
      selectionEnabled: true,
      container: 'layers-container'
    });
    const legend: Legend = new Legend({
      view: this.view,
      container: 'legend-container'
    });

    this.map.when(() => {

      const toggleThemes = () => {
        this.darkEnabled = !this.darkEnabled;
        this.map!.basemap = this.darkEnabled ? Basemap.fromId('osm-dark-gray') : Basemap.fromId('osm');
      };
      document.querySelector('calcite-switch')!.addEventListener('calciteSwitchChange', toggleThemes);
    });

    return this.view.when();

  }

}
