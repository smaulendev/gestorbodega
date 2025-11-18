import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class IngresarStockDto {
  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsInt()
  productoId: number;

  @IsInt()
  loteId: number;

  @IsInt()
  bodegaId: number;

  @IsInt()
  ubicacionId: number;
}
