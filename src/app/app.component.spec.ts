import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';

describe('AppComponent', (): void => {
  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', (): void => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Angular-Portfolio-Seite' title`, (): void => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.componentInstance;
    expect(app.title).toEqual('Angular-Portfolio-Seite');
  });

  it('should render title', (): void => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Angular-Portfolio-Seite');
  });
});
