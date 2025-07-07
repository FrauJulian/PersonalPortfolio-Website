import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprintComponent } from './imprint.component';

describe('ImprintComponent', (): void => {
  let component: ImprintComponent;
  let fixture: ComponentFixture<ImprintComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ImprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
