// convert-price.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertPrice',
  standalone: true
})
export class ConvertPricePipe implements PipeTransform {
  transform(price: string, currencyValue: number): number {
    if (!price ){
      price = '50 €'
    }
    
    const cleanedPrice = parseFloat(price.replace(/\$|\s/g, ''));
    return parseFloat((cleanedPrice * currencyValue).toFixed(2));
  }
}