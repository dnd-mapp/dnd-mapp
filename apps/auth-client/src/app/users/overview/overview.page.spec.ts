import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersOverviewPage } from './overview.page';

describe('Overview', () => {
    let component: UsersOverviewPage;
    let fixture: ComponentFixture<UsersOverviewPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsersOverviewPage],
        }).compileComponents();

        fixture = TestBed.createComponent(UsersOverviewPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
