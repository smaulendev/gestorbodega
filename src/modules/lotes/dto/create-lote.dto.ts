import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  codigoLote: string;

  @IsDateString()
  @IsNotEmpty()
  fechaCaducidad: string;

  @IsInt()
  @IsNotEmpty()
  productoId: number;
}
