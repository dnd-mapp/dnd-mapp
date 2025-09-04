import { MagicSchool } from '../magic-school.enum';
import { MaterialComponent } from './material-component.model';
import { CastingComponent } from './spell-component.enum';

export class Spell {
    public id: string;
    public name: string;
    public level: number;
    public school: MagicSchool;
    public ritual: boolean;
    public castingTime: string;
    public range: string;
    public components: CastingComponent[];
    public materials: MaterialComponent[];
    public concentration: boolean;
    public duration: string;
    public description: string;
    public higherLevelCasting: string;
}
