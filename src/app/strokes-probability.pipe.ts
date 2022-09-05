import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'strokesPipe',
    pure: true
})
export class StrokesPipe implements PipeTransform {
    transform(strokes) {
        if (!isNaN(strokes)) {
            const returnValue = parseFloat(strokes);
            return returnValue.toFixed(Math.max(2, (returnValue.toString().split('.')[1] || []).length))
        }
        else{
            const returnValue = this.toTitleCase(strokes);
            return returnValue;
        }
    }

    toTitleCase(str) {
        return str.toLowerCase().split(' ').map(function (word) {
          return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
}
