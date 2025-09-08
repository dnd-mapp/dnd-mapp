import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateLayerComponent } from './state-layer.component';

describe('StateLayerComponent', () => {
    let component: StateLayerComponent;
    let fixture: ComponentFixture<StateLayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StateLayerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StateLayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
