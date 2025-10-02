import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class Spell {
    @IsNotEmpty()
    @IsString()
    public readonly id: string;

    @MinLength(2)
    @IsNotEmpty()
    @IsString()
    public name: string;
}
