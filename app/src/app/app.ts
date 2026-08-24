import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { AuthService } from './core/services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.initializeSession().subscribe();
  }
}