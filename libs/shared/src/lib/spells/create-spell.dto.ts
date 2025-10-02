import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpellDto {
    @IsNotEmpty()
    @IsString()
    public name: string;
}
