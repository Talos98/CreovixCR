import {ComponentFixture, TestBed} from '@angular/core/testing'
import {describe, beforeEach, it, expect} from 'vitest'
import {NoAuthorization} from './no-authorization'

describe('NoAuthorization', () => {
  let component: NoAuthorization;
  let fixture: ComponentFixture<NoAuthorization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAuthorization],
    }).compileComponents();

    fixture = TestBed.createComponent(NoAuthorization);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
