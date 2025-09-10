import { Pipe, PipeTransform } from '@angular/core';
import { MAX_BADGE_COUNT } from './models';

@Pipe({
    name: 'badgeCount',
    pure: true,
})
export class BadgeCountPipe implements PipeTransform {
    public transform(value: number) {
        if (value <= MAX_BADGE_COUNT) return `${value}`;
        return '999+';
    }
}
