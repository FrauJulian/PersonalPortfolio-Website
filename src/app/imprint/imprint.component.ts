import {Component, OnInit} from '@angular/core';
import {FooterComponent} from '../footer/footer.component';
import {RouterLink} from '@angular/router';
import {globalFields} from '../../global.fields';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FaIconComponent, IconDefinition} from '@fortawesome/angular-fontawesome';
import {faArrowDown, faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-imprint',
  imports: [
    FooterComponent,
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './imprint.component.html'
})
export class ImprintComponent implements OnInit {
  protected readonly globalFields: typeof globalFields = globalFields;

  protected readonly street: string = 'Ulmenstraße';
  protected readonly houseNumber: number = 9;
  protected readonly zip: number = 3380;
  protected readonly city: string = 'Pöchlarn';
  protected readonly country: string = 'Austria';
  protected readonly abuseMail: string = 'abuse@lechner-systems.at';

  protected contactSafeMail!: SafeUrl;
  protected abuseSafeMail!: SafeUrl;

  protected readonly faArrowRight: IconDefinition = faArrowRight;
  protected readonly faArrowLeft: IconDefinition = faArrowLeft;

  constructor(private _sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.contactSafeMail = this._sanitizer.bypassSecurityTrustUrl(`mailto:${globalFields.contactMail}`);
    this.abuseSafeMail = this._sanitizer.bypassSecurityTrustUrl(`mailto:${this.abuseMail}`);
  }
}
