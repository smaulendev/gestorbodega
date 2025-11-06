import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsBoolean()
  @IsOptional()
  esConsumible?: boolean = false;

  @IsNumber()
  @Min(0)
  costoUnitario: number;

  @IsNumber()
  @Min(0)
  precioSugerido: number;
}
