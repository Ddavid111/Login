import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, 
    MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';
  token: string = '';

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
  }

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private route: ActivatedRoute,) {}

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        alert('Sikeres bejelentkezés!');
      },
      err => {
        alert('Hibás bejelentkezési adatok!');
      }
    );
  }

  forgotPassword() {
    if (!this.email) {
      console.log('Kérlek add meg az email címedet!');
      return;
    }
  
    const payload = { email: this.email };
    this.http.post('http://localhost:3000/api/forgot-password', payload).subscribe(
      (response) => {
        console.log('Jelszó visszaállítási email sikeresen elküldve!', response);
      },
      (error) => {
        console.error('Hiba a jelszó visszaállításakor:', error);
      }
    );
  }





}