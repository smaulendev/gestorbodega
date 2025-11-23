import { IsString, IsInt, Min } from 'class-validator';

export class ConfirmarPickingDto {
  @IsString()
  sku: string; // código de producto escaneado

  @IsString()
  codigoLote: string; // lote que escanea el operario

  @IsInt()
  @Min(1)
  cantidad: number;
}
