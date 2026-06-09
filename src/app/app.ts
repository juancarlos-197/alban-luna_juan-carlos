import { Component } from '@angular/core';
import { Feature } from './feature/feature';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Feature],
  template: '<app-feature>'
})
export class App {

}
