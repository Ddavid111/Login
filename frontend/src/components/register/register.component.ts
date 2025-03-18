import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  imports: [FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, 
    MatCardModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullname = '';
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const user = {
      fullname: this.fullname,
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(user).subscribe(
      () => {
        alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
        this.router.navigate(['/login']);
      },
      err => {
        alert('Hiba történt a regisztráció során!');
      }
    );
  }
}
