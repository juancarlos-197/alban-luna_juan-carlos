import { Component } from '@angular/core';
import { Feature } from './feature/feature';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Feature],
 templateUrl: './app.html',
  styleUrls: ['./app.css']})
export class App {

}
