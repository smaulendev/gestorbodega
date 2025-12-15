// src/modules/inventario/dto/ajustar-stock.dto.ts
import { IsInt, Min, IsIn, IsString } from 'class-validator';

export class AjustarStockDto {
  @IsInt()
  @Min(1)
  cantidad: number; // cantidad a sumar o restar

  @IsIn(['POS', 'NEG'])
  tipo: 'POS' | 'NEG'; // POS = sumar, NEG = restar

  @IsString()
  motivo: string; // Ej: "Ajuste por conteo físico"
}
