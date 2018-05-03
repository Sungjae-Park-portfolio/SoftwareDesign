import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CrisisButtonComponent} from './crisis-button.component';
import {CustomModule} from './custom.module';
import {MatDialogRef, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

describe('Crisis Button', () => {

    let crisisButtonComponent: CrisisButtonComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };

    let fixture: ComponentFixture<CrisisButtonComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [CrisisButtonComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(CrisisButtonComponent);
        crisisButtonComponent = fixture.componentInstance;
    });

    // it('should close properly', () => {
    //     crisisButtonComponent.onNoClick();
    //     expect(calledClose).toBe(true);
    // });
});
