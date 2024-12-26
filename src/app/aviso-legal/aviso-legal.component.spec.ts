import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoLegalComponent } from './aviso-legal.component';

describe('AvisoLegalComponent', () => {
  let component: AvisoLegalComponent;
  let fixture: ComponentFixture<AvisoLegalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisoLegalComponent]
    });
    fixture = TestBed.createComponent(AvisoLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
