import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetAllRolesQueryParam {
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    @Transform(({ value }) => `${value}`.split(','))
    hasRoles: string[];
}
