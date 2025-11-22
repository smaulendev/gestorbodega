// import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

// export class IngresarStockDto {
//   @IsInt()
//   @IsPositive()
//   cantidad: number;

//   @IsInt()
//   productoId: number;

//   @IsInt()
//   loteId: number;

//   @IsInt()
//   bodegaId: number;

//   @IsInt()
//   ubicacionId: number;
// }

// import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

// export class IngresarStockDto {
//   @IsString()
//   @IsNotEmpty()
//   sku: string;

//   @IsString()
//   @IsNotEmpty()
//   lote: string;

//   @IsString()
//   @IsNotEmpty()
//   bodegaId: string;

//   @IsString()
//   @IsNotEmpty()
//   ubicacionId: string;

//   @IsInt()
//   @IsPositive()
//   cantidad: number;

//   @IsString()
//   @IsNotEmpty()
//   fechaExpiracion: string;
// }


import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IngresarStockDto {
  @IsNumber()
  cantidad: number;

  @IsNumber()
  productoId: number;

  @IsNumber()
  loteId: number;

  @IsNumber()
  bodegaId: number;

  @IsNumber()
  ubicacionId: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
