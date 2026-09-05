import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initCollapses } from 'flowbite/lib/esm/components/collapse';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'novamart-frontend';

  ngOnInit(): void {
    setTimeout(() => {
      initCollapses();
    }, 100);
  }
}
