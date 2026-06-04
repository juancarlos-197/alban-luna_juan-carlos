import { Component } from '@angular/core';
import { Page } from './page/page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Page],
  template: '<app-page></app-page>'
})
export class App {}
