import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StalkerComponent} from './stalker.component';

describe('StalkerComponent', (): void => {
  let component: StalkerComponent;
  let fixture: ComponentFixture<StalkerComponent>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [StalkerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StalkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
