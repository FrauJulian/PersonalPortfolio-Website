import {bootstrapApplication} from '@angular/platform-browser';
import {ApplicationRef} from '@angular/core';

import {AppComponent} from './app/app.component';
import {config} from './app/app.config.server';

const bootstrap: () => Promise<ApplicationRef> = (): Promise<ApplicationRef> => bootstrapApplication(AppComponent, config);

export default bootstrap;
