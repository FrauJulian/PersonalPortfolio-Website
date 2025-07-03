import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {globalFields} from '../../global.fields';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  protected readonly globalFields: typeof globalFields = globalFields;

  protected readonly currentYear: number = new Date().getFullYear();
}
