import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
import {faArrowRight, faArrowLeft, faArrowDown, faStar, faEnvelope, faPhone} from '@fortawesome/free-solid-svg-icons';
import {
  faDiscord,
  faGithub,
  faXing,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {FaIconComponent, IconDefinition} from '@fortawesome/angular-fontawesome';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {interval, Subscription} from 'rxjs';
import MarkdownIt from 'markdown-it';

import {globalFields} from '../../global.fields';
import {FooterComponent} from '../footer/footer.component';
import {MatDialog} from '@angular/material/dialog';
import {StalkerComponent} from '../stalker/stalker.component';

interface Project {
  Link: string;
  Title: string;
  FullName?: string;
  Description: string;
  Languages: string[];
  DefaultBranch?: string;
  Stars?: number;
  IsReadmeShown: boolean;
  Readme?: string;
  Clickable?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FooterComponent,
    NgIf,
    FaIconComponent,
    NgForOf
  ],
  templateUrl: './home.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  protected readonly globalFields: typeof globalFields = globalFields;

  protected readonly age: number | string = this.calculateAge('2009-03-03');

  protected isLongBioShown: boolean = false;
  protected isApiRateLimitExceeded: boolean = false;
  protected readonly faArrowRight: IconDefinition = faArrowRight;
  protected readonly faArrowLeft: IconDefinition = faArrowLeft;
  protected readonly faArrowDown: IconDefinition = faArrowDown;
  protected readonly faStar: IconDefinition = faStar;
  protected readonly faEnvelope: IconDefinition = faEnvelope;
  protected readonly faPhone: IconDefinition = faPhone;
  readonly faDiscord: IconDefinition = faDiscord;
  readonly faGithub: IconDefinition = faGithub;
  readonly faXing: IconDefinition = faXing;
  readonly faLinkedin: IconDefinition = faLinkedin;

  protected readonly contactSafeMail: SafeUrl;

  protected readonly personalInformation: string = 'You found an easter egg, why are you here!?!\nYou want to know more personal things about me? - Then you will find your information here!:\nI am currently building an independent foundation for my financial freedom. I am establishing my own software company specializing in client-based projects.\nMy motto, “No stress in life,” guides me to avoid unnecessary pressure.\nI identify as pansexual, meaning I am attracted to individuals regardless of their gender. - I am in a committed relationship. (I have been a man since the very beginning of my life.)';
  readonly bioTextsList: string[] = [
    'C#',
    '.NET',
    '.NET Framework',
    'WPF',
    'Avalonia',
    'NodeJS',
    'Angular',
    'TypeScript',
    'JavaScript',
    'Java',
    'HTML',
    '(S)CSS',
    'Github',
    'Gitlab',
    'Azure DevOps',
    'Ubuntu',
    'Debian',
    'SSMS',
    'MariaDB',
    'MySQL',
    'Grandle'
  ];

  protected currentIndex = 0;
  private sub!: Subscription;

  protected projects: Project[] = [
    {
      Link: "https://www.synradio.de/",
      Title: "SynRadio",
      Description: "🖥️ An internet radio station that is available on various media.",
      Languages: ["TypeScript", "JavaScript", "HTML", "CSS"],
      Clickable: false,
      IsReadmeShown: false
    },
    {
      Link: "https://www.synhost.de/",
      Title: "SynHost",
      Description: "❓ A support system integrating various platforms and media to offer employees a unified overview.",
      Languages: ["TypeScript"],
      Clickable: false,
      IsReadmeShown: false
    }
  ]

  constructor(private _sanitizer: DomSanitizer, private zone: NgZone, private dialog: MatDialog) {
    this.fillProjects();
    this.contactSafeMail = this._sanitizer.bypassSecurityTrustUrl(`mailto:${globalFields.contactMail}`);
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular((): void => {
      this.sub = interval(1000).subscribe((): void => {
        this.zone.run((): void => {
          this.currentIndex = (this.currentIndex + 1) % this.bioTextsList.length;
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  openStalkerInfo(): void {
    this.dialog.open(StalkerComponent, {
      width: '420px',
      data: { message: this.personalInformation }
    });
  }

  private fillProjects(): void {
    const sortOnKey: <T>(key: keyof T, descending: boolean) => (a: T, b: T) => number = <T>(key: keyof T, descending: boolean): (a: T, b: T) => number => {
      return (a: T, b: T): number => {
        const aValue = a[key] as number;
        const bValue = b[key] as number;
        return descending ? bValue - aValue : aValue - bValue;
      };
    };

    fetch(`https://api.github.com/users/${this.globalFields.githubUsername}/repos?per_page=${this.globalFields.numberOfLoadedRepositories}`)
      .then(async (rawResponse: Response): Promise<any> => {
        if (rawResponse.status === 403) {
          const data = await rawResponse.json();
          if (data.message && data.documentation_url) {
            this.isApiRateLimitExceeded = true;
          }
          throw new Error('403 Forbidden');
        }
        return rawResponse.json();
      })
      .then((allProjects: any): void => {
        allProjects = allProjects.sort(sortOnKey("stargazers_count", true));
        allProjects.sort(sortOnKey("stargazers_count", true)).forEach((currentProject: any): void => {
          if (currentProject === undefined || currentProject.fork === true) return;
          if (currentProject.description == null) currentProject.description = "";
          if (currentProject.name === "FrauJulian") return;

          let newProject: Project = {
            Link: "",
            Title: "",
            FullName: "",
            Description: "",
            Languages: [],
            DefaultBranch: "",
            Stars: 0,
            Clickable: true,
            IsReadmeShown: false,
            Readme: ""
          };

          if (currentProject.language != null) {
            fetch(currentProject.languages_url)
              .then((rawResponse: Response): Promise<any> => rawResponse.json())
              .then((languages: any): void => {
                newProject.Languages = Object.keys(languages);
              });
          } else {
            newProject.Languages = [""];
          }

          fetch(`https://raw.githubusercontent.com/${currentProject.full_name}/${currentProject.default_branch}/README.md`)
            .then((rawResponse: Response): Promise<any> => rawResponse.text())
            .then((readmeText: string): void => {
              newProject.Readme = new MarkdownIt({html: true, linkify: true, typographer: true}).render(readmeText);
            });

          currentProject.name = currentProject.name
            .replaceAll("_", " ")
            .replaceAll("-", " ");

          newProject.Link = currentProject.html_url;
          newProject.Title = currentProject.name;
          newProject.FullName = currentProject.full_name;
          newProject.Description = currentProject.description;
          newProject.DefaultBranch = currentProject.default_branch;
          newProject.Stars = currentProject.stargazers_count;
          newProject.IsReadmeShown = false;

          this.projects.push(newProject);
        });
      });
  }

  protected toggleBio(): void {
    this.isLongBioShown = !this.isLongBioShown;
  }

  protected closeOnOverlayClick(evt: MouseEvent): void {
    if ((evt.target as HTMLElement).classList.contains('long-bio-overlay')) {
      this.isLongBioShown = false;
    }
  }

  private calculateAge(birthDateString: string): number | string {
    let birthDate: Date = new Date(birthDateString);
    let now: Date = new Date();
    let diffMs: number = now.getTime() - birthDate.getTime();
    let diffYears: number = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    let tempAge: string = diffYears.toFixed(1);
    return tempAge.endsWith('.0') ? Math.round(diffYears) : tempAge;
  }
}
