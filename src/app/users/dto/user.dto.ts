import { IsBoolean, IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    password: string
}


export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string

    @IsString()
    @IsOptional()
    image: string

    @IsBoolean()
    @IsOptional()
    isMentor: boolean

    updatedAt: Date
}
