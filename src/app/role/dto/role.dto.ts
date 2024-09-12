import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleDto {

    profession: any

    @IsString()
    @IsNotEmpty()
    professionId: string;


    @IsString()
    @IsNotEmpty()
    name: string;


    @IsNumber()
    @IsNotEmpty()
    sort: number;
}
