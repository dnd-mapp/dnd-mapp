import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ResourceEntity } from '../resources';

export class Spell implements ResourceEntity {
    @IsNotEmpty()
    @IsString()
    public readonly id: string;

    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    public name: string;

    public get label() {
        return this.name ?? 'New Spell';
    }
}
