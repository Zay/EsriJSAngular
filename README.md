# EsriJSAngular
Samples to get Javascript API for ArcGIS running with Angular

# Setting up project
- Run npm install

- Create environment.ts and/or environment.prod.ts and fill in the settings

`export const environment = {
`    production: true, // true/false, is this a production environment?
`    portalAppId: "", // the portal/agol application id
`    portalUrl: "", // the url of the portal, including web adaptor url
`    esriApiKey: "" // the developer API key
`  };
` 

- tweak the start command for url/ssl etc (optional)
- run npm start

# Usage / Intent
When the configuration is setup properly, you will be redirected to AGOL / your portal's signin page
After signing in, you'll be redirected back

In the help panel, we will try to print your current user name.